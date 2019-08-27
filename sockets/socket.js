var getSession = (io, socket) => {
        console.log(io.sockets.adapter.sids[socket.id]);
        return Object.keys(io.sockets.adapter.sids[socket.id])[1];
}

var joinSession = (socket, sessionId) => {
        socket.join(sessionId);
}

module.exports = function(io) {

        // io.on('connection', socket => {
        //         socket.join('ceva');
        //         console.log(getSession(io, socket));
        // })
        require('./hangmanSocket')(io);
}