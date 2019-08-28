var getSession = (socket) => {
        return Object.keys(socket.rooms)[1];
}

var serverData = {
        hangman: {}
}

module.exports = function(io) {

        require('./hangmanSocket')(io, getSession, serverData.hangman);
}