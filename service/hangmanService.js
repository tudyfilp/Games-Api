const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

const repository = new HangmanFirebaseRepository(db);

const getNewSession = async (req, res) => {

    let existingSession = await (repository.getSessionByUserKey(req.body.userId));

    if (existingSession === null) {
        repository.getSession(async (session) => {
            if (session === null) {
                session = await repository.addSession();
            }
            delete session.sessionData.phrase;
            delete session.sessionData.phraseLetters;
            res.send(JSON.stringify(session));
        });
    }
    else {
        res.send(JSON.stringify(existingSession));
    }
};

const addUserToSession = async (userId, sessionKey) => {

    let session = await repository.getSessionByKey(sessionKey);
    repository.addUser(userId, session.data);
    session.data.availablePlaces = session.data.availablePlaces - 1;

    repository.setSession(sessionKey, session.data);

}


const registerNewLetter = (userId, session, letter) => {


    repository.registerLetter(userId, session.data, letter);

    if (repository.isPhraseComplete(session))
        repository.endGame(session);

}

const getHangmanSocketService = (socket, getSession) => {
    return {
        letterPressed: async ({ sessionId, userId, letter }) => {
            let session = await repository.getSessionByKey(sessionId);
            registerNewLetter(userId, session, letter);

            delete session.data.phrase;
            delete session.data.phraseLetters;

            socket.emit('sessionUpdated', session);

            repository.setSession(session.id, session.data);
        }
    }
}

module.exports = {
    getNewSession,
    addUserToSession,
    getHangmanSocketService
};