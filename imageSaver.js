const fs = require('fs');

module.exports = function(file, filename) {
    
    fs.writeFile(__dirname + `/images/${filename}.jpg`, file.buffer, 
    (err) => {
        console.log(err);
    });
}