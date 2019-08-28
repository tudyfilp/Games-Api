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

const getSessionMessages = (gameData, sessionKey) => {
    if(!gameData.hasOwnProperty(sessionKey)) 
        throw new Error('No session has been found for the given key');
    
    return gameData[sessionKey].messages;
    
}

module.exports = function(io, getSession, gameData) {

    io.of('/hangman').on('connection', async (socket) => {
        
        let sessionName = socket.handshake.query.roomName;
        let userId = socket.handshake.query.userId;
        if(isNewSession(gameData, sessionName))
            await createSession(gameData, sessionName);

        socket.join(sessionName, () => {
            hangmanService.addUserToSession(userId, sessionName);

            socket.emit('getMessages', getSessionMessages(gameData, sessionName));

            const hangmanSocketService = hangmanService.getHangmanSocketService(socket, getSession);
            const gameSocketService = gamesService.getGamesSocketService(socket, getSession, gameData[sessionName].messages);

            socket.on('newMessage', gameSocketService.handleChat);

            socket.on('letterPressed', hangmanSocketService.letterPressed);

        });
        
    });
}