var router = require('express').Router();

router.post('/hangman', (req, res) => {
    res.send(JSON.stringify('cevaKeyRandom'));
}); 


module.exports = router;