const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');
const db = require('../Firebase/Firestore');
let repo = new HangmanFirebaseRepository(db);

var getSession = (socket) => {
    return Object.keys(socket.rooms)[1];
}

module.exports = function(io) {

    io.of('/hangman').on('connection', socket => {
        // joinSession(socket, socket.handshake.query.roomName);
        let roomName = socket.handshake.query.roomName;
        console.log('hello, there!');
        socket.join(roomName, () => {

            socket.on('newMessage', (message) => {
                console.log(message);

                socket.to(getSession(socket)).emit('receivedMessage', {
                    message,
                    sender: 'not_me'
                });
            });

            socket.on('letterPressed', ({sessionId, userId, letter}) => {
                console.log(sessionId, userId, letter);
            });
        });

        socket.on('disconnect', () => {
            console.log('whoops, someone just left');
        })
        
    });
}