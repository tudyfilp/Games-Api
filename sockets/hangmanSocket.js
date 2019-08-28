let hangmanService = require('../service/hangmanService');
let gamesService = require('../service/gamesService');

module.exports = function(io, getSession) {

    io.of('/hangman').on('connection', socket => {
        let roomName = socket.handshake.query.roomName;
        let userId = socket.handshake.query.userId;
        console.log(`hello, there ${userId}!`);
        socket.join(roomName, () => {

            hangmanService.addUserToSession(userId, roomName);

            const hangmanSocketService = hangmanService.getHangmanSocketService(socket, getSession);
            const gameSocketService = gamesService.getGamesSocketService(socket, getSession);

            socket.on('newMessage', gameSocketService.handleChat);

            socket.on('letterPressed', hangmanSocketService.letterPressed);

        });

        socket.on('disconnect', () => {
            console.log('whoops, someone just left');
        })
        
    });
}