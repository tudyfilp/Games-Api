module.exports = function(io, socket, getSocketSession) {

    socket.on('letterSumitted', letter => {
        console.log(letter);
    });
}