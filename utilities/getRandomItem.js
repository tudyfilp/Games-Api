const getRandomItem = function(arr) {
    let arrayLength = arr.length;

    let randomPosition = Math.floor(Math.random()*arrayLength);

    return arr[randomPosition];
}

module.exports = getRandomItem