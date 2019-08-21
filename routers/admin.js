var router = require('express').Router();
var path = require('path');
const multer = require('multer');
const upload = multer();
const saveImage = require('../imageSaver');

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/admin.html'));
})

router.get('/addGame', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/addGame.html'))
})

router.post('/newGame', upload.any(), (req, res) => {
    if(req.files.length > 0){
        saveImage(req.files[0]);
        res.send(JSON.stringify('New Game Saved Successfully'));
    } else {
        res.send(JSON.stringify("Image not provided!"));
    }

})

module.exports = router;