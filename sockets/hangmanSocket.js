module.exports = function(io, getSocketSession) {

    io.of('/hangman').on('connection', socket => {
        console.log('new hangman connection');
    });
}