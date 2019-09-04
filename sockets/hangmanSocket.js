let hangmanService = require('../service/hangmanService');
let gamesService = require('../service/gamesService');

const isNewSession = (gameData, sessionKey) => {
    if(gameData.hasOwnProperty(sessionKey) && !gameData[sessionKey].data)
        return true;
    return !gameData.hasOwnProperty(sessionKey);
}

const createSession = async (gameData, sessionKey) => {
    gameData[sessionKey] = {};
    let session = await (hangmanService.getSessionByKey(sessionKey));
    gameData[sessionKey].data = session.data;
    gameData[sessionKey].messages = [];
}

const getSessionMessages = (gameData, sessionKey) => {

    if(!gameData.hasOwnProperty(sessionKey))
        throw new Error('No session has been found for the given key');

    return gameData[sessionKey].messages;

}

const getSessionData = (gameData) => {
    return (sessionKey) => {
        if(!gameData.hasOwnProperty(sessionKey))
            throw new Error('No session has been found for the given key');

        return {
            data: gameData[sessionKey].data,
            id: sessionKey
        }
    }
}

const emitToSession = (socket, sessionKey, eventName, eventData, ) => {
    socket.emit(eventName, eventData);
    socket.to(sessionKey).emit(eventName, eventData);
}

module.exports = function(io, getSession, gameData) {

    io.of('/hangman').on('connection', async (socket) => {

        let sessionKey = socket.handshake.query.roomName;
        let userId = socket.handshake.query.userId;

        if(isNewSession(gameData, sessionKey)){
            await createSession(gameData, sessionKey);
        }

        socket.join(sessionKey, async () => {
            await hangmanService.addUserToSession(userId, sessionKey, getSessionData(gameData));

            
            socket.emit('sessionUpdated', getSessionData(gameData)(sessionKey));
            socket.emit('getMessages', getSessionMessages(gameData, sessionKey));
            // let session = await(hangmanService.getSessionByKey(sessionKey));
            emitToSession(socket, sessionKey, "newUser", {sender: "server", username: gameData[sessionKey].data.users[userId].username});
            // socket.emit('newUser', {sender: "server", username: gameData[sessionKey].data.users[userId].username});

            const hangmanSocketService = hangmanService.getHangmanSocketService(gameData, socket, getSession, getSessionData(gameData), emitToSession);
            const gameSocketService = gamesService.getGamesSocketService(socket, getSession, getSessionMessages(gameData, sessionKey));

            socket.on('newMessage', gameSocketService.handleChat);
            socket.on('letterPressed', hangmanSocketService.letterPressed);
            socket.on('disconnectFromSession', () => {
                socket.disconnect();
                console.log(gameData);
            });

        });

    });
}