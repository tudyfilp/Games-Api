module.exports = function(io, socket, getSession) {

    socket.on('letterSumitted', letter => {
        console.log(letter);
    });
}