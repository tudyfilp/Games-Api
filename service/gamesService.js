const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');

const repository = new GamesFirebaseRepository(db);
const getAllGames = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let games = await repository.getAll();
    console.log(games);
    res.end(JSON.stringify(
        {
            status: 'OK',
            message: games.docs
        }
        ));           

    };


const addSentence =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true && req.body.hasOwnProperty('gameKey') === true) {
        try {
            let result = await repository.addSentence(req.body.gameKey, req.body.sessionKey);
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
                message: 'No gameKey or sessionKey was supplied.'
            }
        ));
    }
};


const getSession =  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('key') === true) {
        try {
            repository.getSession(req.body.key, (id)=>{
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
    }
    else {
        res.end(JSON.stringify(
            {
                status: 'ERROR',
                message: 'No key was supplied.'
            }
        ));
    }
};

module.exports = {
    getSession: getSession,
    addSentence: addSentence,
    getAllGames: getAllGames
};