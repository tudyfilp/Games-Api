const db = require('../Firebase/Firestore');
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');
const saveImage = require('../imageSaver');

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

const createGame = async (req, res) => {

    let gamesRepo = new GamesFirebaseRepository(db);

    let gameKey = await gamesRepo.add({
        name: req.body.name
    });

    if(req.files.length > 0){
        saveImage(req.files[0], gameKey);
        res.send(JSON.stringify('New Game Saved Successfully'));
    } else {
        res.send(JSON.stringify("Game added sucesfully but no game thumbnail has been provided"));
    }
    
}

const savePhrases = (req, res) => {
    if(req.files.length > 0){
        
        let file = req.files[0];
        let phrasesText = file.buffer;

        let categoryName = file.originalname.split('.')[0];

        let phrases = formatPhrasesText(phrasesText);

        console.log(phrases);
    }
    
}

const formatPhrasesText = (txt) => {
     return txt.toString().split('\n').map(phrase => phrase.trim().replace(/\r/g, '')).filter(phrase => phrase != '');
}

module.exports = {
    getSession: getSession,
    addSentence: addSentence,
    getAllGames: getAllGames,
    createGame,
    savePhrases
};