var router = require('express').Router();
var path = require('path');
const multer = require('multer');
const upload = multer();
const adminService = require('../service/adminService');

router.get('/', adminService.isAuth,  (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/admin.html'));
})

router.post('/logout', adminService.logoutAdmin);

router.get('/createGame', adminService.isAuth, (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/createGame.html'))
})

router.post('/createGame', [upload.any(), adminService.isAuth], adminService.createGame)

router.get('/hangman', adminService.isAuth, (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/admin/games/hangman.html'));
})

router.post('/hangmanPhrases', [upload.any(), adminService.isAuth], adminService.savePhrases);

module.exports = router;