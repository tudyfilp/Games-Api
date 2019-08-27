var router = require('express').Router();
const HangmanRepo = require('../repository/HangmanFirebaseRepository');
const db = require('../Firebase/Firestore');
var repo = new HangmanRepo(db);

router.post('/hangman', (req, res) => {
    repo.getSession((sessionData) => {
        res.send(JSON.stringify(sessionData));
    });
    
}); 


module.exports = router;