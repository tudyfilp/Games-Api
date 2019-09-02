const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');
const UserFirebaseRepository = require('../repository/UserFirebaseRepository');

const repository = new HangmanFirebaseRepository(db);
const userRepository = new UserFirebaseRepository(db);

const mergeUsernamesIntoSession = async (sessionData) => {

    for (let userKey in sessionData.users) {
        sessionData.users[userKey].username = (await userRepository.getItemById(userKey)).username;
    }

    return sessionData;
};

const getNewSession = (req, res) => {
    repository.getSession(async (session) => {
        if(session === null){
            session = await repository.addSession();
        }
        
        delete session.sessionData.phrase;
        delete session.sessionData.phraseLetters;

        await mergeUsernamesIntoSession(session.sessionData);

        res.send(JSON.stringify(session));
    });
    
};

const addUserToSession = async (userId, sessionKey, getSessionData) => {
    let session = getSessionData(sessionKey);

    if (await(repository.isUserInSession(userId, sessionKey)) === false) {
        repository.addUser(userId, session.data);
        session.data.activeUsers.push(userId);
        session.data.availablePlaces = session.data.availablePlaces - session.data.activeUsers.length;
    }
    repository.setSession(sessionKey, session.data);

}


const registerNewLetter = (userId, session, letter) => {
    repository.registerLetter(userId, session.data, letter);

    if (repository.isPhraseComplete(session))
        repository.endGame(session);

}

const getHangmanSocketService = (socket, getSession, getSessionData) => {
    return {
        letterPressed: async ({sessionId, userId, letter}) => {

            let session = getSessionData(sessionId);
            registerNewLetter(userId, session, letter);

            let sessionCopy = JSON.parse(JSON.stringify(session));
            
            // if(isGameEnded(session))
            //     delete session;
            
            delete sessionCopy.data.phrase;
            delete sessionCopy.data.phraseLetters;
            
            await mergeUsernamesIntoSession(sessionCopy.data);
            
            socket.emit('sessionUpdated', sessionCopy);

            repository.setSession(session.id, session.data);
        }
    }
}

const isGameEnded = (session) => {
    return session.data.gameEnded;
}

const getSessionByKey = async (sessionKey) => {
    return await repository.getSessionByKey(sessionKey);
}

module.exports = {
    getNewSession,
    addUserToSession,
    getHangmanSocketService,
    getSessionByKey
};