module.exports = function(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}