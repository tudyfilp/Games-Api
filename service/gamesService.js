const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

const repository = new GamesFirebaseRepository(db);
const hangmanRepository = new HangmanFirebaseRepository(db);

const getAllGames = async (req, res) => {
    hangmanRepository.addUser("userKey3","ShvRKJckl57Oz5X1v12p");
    res.setHeader('Content-Type', 'application/json');
    let games = await repository.getAll();
    res.end(JSON.stringify(
        {
            status: 'OK',
            message: games
        }
    ));

};

const setSessionField = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true) {
        try {
            let result = await repository.setSessionField(req.body.sessionKey, { phrase: "Harry", availablePlaces: 4 });
            res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: result
                }
            ));
        }
        catch (e) {
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

const getSession = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('gameKey') === true) {
        try {
            repository.getSession(req.body.gameKey, async (session)=>{

                if(session === null){
                    session = await hangmanRepository.addSession();
                }
                res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: session
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
                message: 'No gameKey was supplied.'
            }
        ));
    }
};

module.exports = {
    getSession: getSession,
    setSessionField: setSessionField,
    getAllGames: getAllGames,
};