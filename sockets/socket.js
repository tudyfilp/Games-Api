var getSession = (io) => {
    return (socket) => {
        return Object.keys(io.sockets.adapter.sids[socket.id])[1];
    }
}

module.exports = function(io) {

        let getSocketSession = getSession(io);
        require('./hangmanSocket')(io, getSocketSession);
}