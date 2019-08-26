const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');

const repository = new GamesFirebaseRepository(db);

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

const setSessionField =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true) {
        try {
            let result = await repository.setSessionField(req.body.sessionKey,{phrase: "Harry", availablePlaces:4});
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
    if (req.body.hasOwnProperty('gameKey') === true) {
        try {
            repository.getSession(req.body.gameKey,(id)=>{
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
                message: 'No sessionKey was supplied.'
            }
        ));
    }
};

module.exports = {
    getSession: getSession,
    setSessionField: setSessionField,
    getAllGames: getAllGames,
};