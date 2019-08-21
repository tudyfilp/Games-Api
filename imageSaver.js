const fs = require('fs');

module.exports = function(file) {
    let filename = file.originalname;
    fs.writeFile(__dirname + `/images/${filename}`, file.buffer, 
    (err) => {
        console.log(err);
    });
}