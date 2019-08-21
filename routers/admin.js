var router = require('express').Router();
var path = require('path');
const multer = require('multer');
const upload = multer();

const gameService = require('../service/gamesService');

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/admin.html'));
})

router.get('/createGame', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/createGame.html'))
})

router.post('/createGame', upload.any(), gameService.createGame)

router.get('/hangman', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/games/hangman.html'));
})

router.post('/hangmanPhrases', upload.any(), gameService.savePhrases);

module.exports = router;