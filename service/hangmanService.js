const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

const repository = new HangmanFirebaseRepository(db);

const getSession = (req, res) => {
    repository.getSession((sessionData) => {
        res.send(JSON.stringify(sessionData));
    });
    
};

module.exports = {
    getSession
};