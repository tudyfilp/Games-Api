const db = require('../Firebase/Firestore');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

const repository = new HangmanFirebaseRepository(db);
//get random sentence from category from database
const getAllGames = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let games = await repository.getAll();
    res.end(JSON.stringify(
        {
            status: 'OK',
            message: games
        }
        ));           

    };

const addCategory =  async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
            try {
                let result = await repository.addCategory();
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
    };

const addSentence =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true) {
        try {
            let result = await repository.addSessionField(req.body.sessionKey,{phrase: "Harry Potter", availablePlaces:4});
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


const getSession =  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
        try {
            repository.getSession((id)=>{
                res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: id
                }
            ));});            
        }
        catch(e) {
            res.end(JSON.stringify(
                {
                    status: 'ERROR',
                    message: e.message
                }
            ));
        }

};

module.exports = {
    getSession: getSession,
    addSentence: addSentence,
    getAllGames: getAllGames,
    addCategory: addCategory
};