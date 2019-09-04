const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');
const HangmanFirebaseRepository = require('../repository/HangmanFirebaseRepository');

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

const getGameData = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let gamesRepo = new GamesFirebaseRepository(db);

    if (req.body.hasOwnProperty('id') === true) {
        let gameId = req.body.id;

        try {
            let gameData = await gamesRepo.getGameData(gameId);
            res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: gameData
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
                message: "No game id was provided."
            }
        ));
    }
}

const setSentences =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        let result = await repository.setSentences("food", ["food1","food2"]);
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

const getGamesSocketService = (socket, getSession, messages) => {
    return {
        handleChat: ({message, sender}) => {
            messages.push({message, sender});
            socket.to(getSession(socket)).emit('receivedMessage', {
                message,
                sender
            });
            
        }
    }
}

module.exports = {
    setSessionField,
    getAllGames,
    getGameData,
    setSentences,
    getGamesSocketService
};