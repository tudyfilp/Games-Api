var router = require('express').Router();
const hangmanService = require('../service/hangmanService');

router.post('/hangman/getNewSession', hangmanService.getNewSession); 
router.post('/hangman/prepareClientToConnectToGivenSession', hangmanService.prepareClientToConnectToGivenSession);

module.exports = router;