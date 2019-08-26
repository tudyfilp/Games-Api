var getSession = (io) => {
    return (socket) => {
        return Object.keys(io.sockets.adapter.sids[socket.id])[1];
    }
}

module.exports = function(io) {
    io.on('connection', (socket) => {

        let getSocketSession = getSession(io);

        socket.join(socket.handshake.query['roomName']);
        socket.on('newMessage', (message) => {
            socket.broadcast.to(getSocketSession(socket)).emit('receivedMessage', {message, sender:'not_me'});
        });

        require('./hangmanSocket')(io, socket, getSocketSession);
    });

    
}