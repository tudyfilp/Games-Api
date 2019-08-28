var router = require('express').Router();
const hangmanService = require('../service/hangmanService');

router.post('/hangman', hangmanService.getNewSession); 

module.exports = router;