var getSession = (io) => {
    return Object.keys(io.sockets.adapter.sids[socket.id])[1];
}

module.exports = function(io) {
    io.on('connection', (socket) => {

        socket.join(socket.handshake.query['roomName']);

        socket.on('newMessage', (message) => {
            socket.broadcast.to(getSession(io, socket)).emit('receivedMessage', {message, sender:'not_me'});
        });

        require('./hangmanSocket')(io, socket, getSession);
    });

    
}