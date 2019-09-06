const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');
const UserFirebaseRepository = require('../repository/UserFirebaseRepository');
const HangmanValidator = require('../validator/HangmanValidator');

const repository = new HangmanFirebaseRepository(db, HangmanValidator);
const userRepository = new UserFirebaseRepository(db);

const mergeUsernamesIntoSession = async (sessionData) => {

    for (let userKey in sessionData.users) {
        sessionData.users[userKey].username = (await userRepository.getItemById(userKey)).username;
    }

    return sessionData;
};

const getPlayerUsername = async (userKey) => {
    return (await userRepository.getItemById(userKey)).username;
}

const getNewSession = async (req, res) => {
    let existingSession = await (repository.getSessionByUserKey(req.body.userId));
    if (existingSession === null) {
        repository.getSession(async (session) => {
            if (session === null) {
                session = await repository.addSession();
            }
            delete session.sessionData.phrase;
            delete session.sessionData.phraseLetters;

            await mergeUsernamesIntoSession(session.sessionData);
            res.send(JSON.stringify(session));
        });
    }
    else {

        await mergeUsernamesIntoSession(existingSession.sessionData);
        res.send(JSON.stringify(existingSession));
    }
};

const prepareClientToConnectToGivenSession = async (req, res) => {
    let sessionKey = req.body.sessionKey;
    let userKey = req.body.userKey;

    let clientsActiveSession = await repository.getSessionByUserKey(userKey);
    if(clientsActiveSession != null){
        try {
            await repository.removeUserFromSession(userKey, sessionKey);

            res.send(JSON.stringify({
                status: 'OK'
            }));
        } catch (err) {
            res.send(JSON.stringify({
                status: 'ERROR',
                message: err
            }));
        }
    } else {
        res.send(JSON.stringify({
            status: 'OK'
        }))
    }

}

const deleteUserFromOldSession = (userId, gameData) => {
    for(sessionKey in gameData) {
        let session = gameData[sessionKey];
        if(isUserInSession(session, userId)){
            removeUserFromSessionMemory(session, userId);
            return;
        }
    }
}

const addUserToSession = async (userId, sessionKey, getSessionData, gameData) => {
    deleteUserFromOldSession(userId, gameData);
    let session = getSessionData(sessionKey);
    let dbSession = await repository.getSessionByKey(sessionKey);
    if (!isUserInSession(dbSession, userId)) {
        repository.addUser(userId, session.data);
    } else {
        let userData = dbSession.data.users[userId];
        session.data.users[userId] = userData;
    }

    if(!session.data.activeUsers.includes(userId))
            session.data.activeUsers.push(userId);
    repository.updateAvailablePlaces(session);
    session.data.users[userId].username = await getPlayerUsername(userId);
    repository.setSession(sessionKey, getSessionForDatabase(session).data);

}

const registerNewLetter = (userId, session, letter) => {
    repository.registerLetter(userId, session.data, letter);
    session.data.pressedLetters[letter] = true; 

    if (repository.isPhraseComplete(session))
        repository.endGame(session);

}

const getSessionForClient = (session) => {
    let sessionCopy = JSON.parse(JSON.stringify(session));

    if(!session.data.gameEnded)
        delete sessionCopy.data.phrase;

    delete sessionCopy.data.phraseLetters;

    return sessionCopy;
}

const getSessionForDatabase = (session) => {
    let sessionCopy = JSON.parse(JSON.stringify(session));

    delete sessionCopy.data.pressedLetters;

    for (let userKey in sessionCopy.data.users) {
        delete sessionCopy.data.users[userKey].username;
    }

    return sessionCopy;
};

const getHangmanSocketService = (gameData, socket, getSession, getSessionData, emitToSession) => {
    var self =  {
        letterPressed: async ({ sessionId, userId, letter }) => {

            let session = getSessionData(sessionId);
            let InitialGuessedLetters = session.data.guessedLetters.slice();

            registerNewLetter(userId, session, letter);

            if(noUserAlive(session))
                endGame(session);

            if (InitialGuessedLetters.length !== session.data.guessedLetters.length)
                emitToSession(socket, getSession(socket), 'userGuessedLetter', { sender: 'server', player: session.data.users[userId].username, letter });

            emitToSession(socket, getSession(socket), 'sessionUpdated', getSessionForClient(session))

            repository.setSession(session.id, getSessionForDatabase(session).data);

            if (isGameEnded(session))
                delete gameData[session.id];
        },
        removeUserFromRoom: (userId, sessionId) => {
            gameData[sessionId].data.activeUsers = gameData[sessionId].data.activeUsers.filter(userKey => userKey !== userId);
            delete gameData[sessionId].data.users[userId];
        },
        removeUserFromSession: async function(userId, sessionId) {
            try {
                await repository.removeUserFromSession(userId, sessionId);

                this.removeUserFromRoom(userId, sessionId);
            }
            catch(e) {
                console.log(e);
            }
        },
        leaveSession: async (userId, sessionKey) => {
            self.removeUserFromSession(userId, sessionKey);

            socket.leave(getSession(socket));
            socket.emit('leftSession');
            
        },
        disconnectFromSession: (userId) => {
            console.log(`user ${userId} disconnected from session`);
            removeUserFromSessionMemory(gameData[getSession(socket), userId]);
            //hangmanSocketService.removeUserFromRoom(userId, sessionKey);
        }
    }
    return self;
}

const removeUserFromSessionMemory = (session, userId) => {
    if(!session)
        return;
    
    delete session.data.users[userId];
    session.data.activeUsers = session.data.activeUsers.filter(userKey => userKey !== userId);
}


const noUserAlive = (session) => {
    let users = session.data.users;

    for(var key in users) {
        if(users[key].lives > 0)
            return false;
    }

    return true;
}

const isGameEnded = (session) => {
    return session.data.gameEnded;
}

const endGame = (session) => {
    session.data.gameEnded = true;
}

const getSessionByKey = async (sessionKey) => {
    return await repository.getSessionByKey(sessionKey);
}

const removeUserFromSession = async (userId, sessionId) => {
    await repository.removeUserFromSession(userId, sessionId);

    return true;
};

const isUserInSession = (session, userId) => {
    return Object.keys(session.data.users).includes(userId);
};


module.exports = {
    getNewSession,
    addUserToSession,
    getHangmanSocketService,
    getSessionByKey,
    removeUserFromSession,
    prepareClientToConnectToGivenSession
};