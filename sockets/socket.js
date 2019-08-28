var getSession = (socket) => {
        return Object.keys(socket.rooms)[1];
}

var joinSession = (socket, sessionId) => {
        socket.join(sessionId);
}

module.exports = function(io) {

        require('./hangmanSocket')(io, getSession);
}