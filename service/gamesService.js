const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');

const repository = new GamesFirebaseRepository(db,"8jmng49yYAUjO8nyDU03");

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

const addSentence =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.hasOwnProperty('sessionKey') === true) {
        try {
            let result = await repository.addSessionField(req.body.sessionKey,{generatedSentence:"Harry",availablePlaces:4});
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
    getAllGames: getAllGames
};