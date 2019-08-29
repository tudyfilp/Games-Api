let hangmanService = require('../service/hangmanService');
let gamesService = require('../service/gamesService');

const isNewSession = (gameData, sessionKey) => {
    return !gameData.hasOwnProperty(sessionKey);
}

const createSession = async (gameData, sessionKey) => {
    gameData[sessionKey] = {};
    let session = await hangmanService.getSessionByKey(sessionKey);
    gameData[sessionKey].data = session.data;
    gameData[sessionKey].messages = [];
}

const getSessionDetailsForClient = (gameData, sessionKey) => {
    if(!gameData.hasOwnProperty(sessionKey)) 
        throw new Error('No session has been found for the given key');
    
    let sessionData = gameData[sessionKey].data;
    
    delete sessionData.phrase;
    delete sessionData.phraseLetters;

    return {
        data: sessionData,
        messages: gameData[sessionKey].messages
    }
    
}

module.exports = function(io, getSession, gameData) {

    io.of('/hangman').on('connection', socket => {
        
        let sessionName = socket.handshake.query.roomName;
        let userId = socket.handshake.query.userId;

        if(isNewSession(gameData, sessionName)) 
            createSession(gameData, sessionName);

        socket.join(sessionName, () => {

            hangmanService.addUserToSession(userId, sessionName);

            const hangmanSocketService = hangmanService.getHangmanSocketService(socket, getSession);
            const gameSocketService = gamesService.getGamesSocketService(socket, getSession, gameData[sessionName].messages);

            socket.on('newMessage', gameSocketService.handleChat);

            socket.on('letterPressed', hangmanSocketService.letterPressed);

        });
        
    });
}