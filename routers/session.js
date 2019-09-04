var router = require('express').Router();
const hangmanService = require('../service/hangmanService');

router.post('/hangman', hangmanService.getNewSession); 
router.post('/hangman/prepareClientToConnectToGivenSession', hangmanService.prepareClientToConnectToGivenSession);
router.post('/hangman/removeUserFromSession', hangmanService.removeUserFromSession);
module.exports = router;