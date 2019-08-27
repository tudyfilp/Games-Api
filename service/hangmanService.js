const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

const repository = new HangmanFirebaseRepository(db);

const setSentences = async (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    try {
        let result = await repository.setSentences("food",["food1","food2"]);
            res.end(JSON.stringify(
            {
                status: 'OK',
                message: result
            }
        ));           
    } catch(e) {
        res.end(JSON.stringify(
            {
                status: 'ERROR',
                message: e.message
            }
        ));
    }
};

const getPhrase =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true) {
        try {
            let result = await repository.getPhrase(req.body.sessionKey);
            console.log(result);
            res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: result
                }
            ));            
        }
        catch(e) {
            res.end(JSON.stringify(
                {
                    status: 'ERROR',
                    message: e.message
                }
            ));
        }
    }
    else {
        res.end(JSON.stringify(
            {
                status: 'ERROR',
                message: 'No sessionKey was supplied.'
            }
        ));
    }
};

module.exports = {
    setSentences,
    getPhrase,
};