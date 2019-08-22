require('dotenv').config();
const GamesFirebaseRepository = require('../repository/GamesFirebaseRepository');
const db = require('../Firebase/Firestore');
const saveImage = require('../imageSaver');

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
        res.send(phrases);
        // console.log(phrases);
    }
    
}

const formatPhrasesText = (txt) => {
     return txt.toString().split('\n').map(phrase => phrase.trim().replace(/\r/g, '')).filter(phrase => phrase != '');
}

const loginAdmin = (req, res) => {
    if(req.body.password === process.env.ADMIN_PASSWORD){
        req.session.isAuth = true;
        res.redirect('/admin');
    }
    else
        res.redirect('/login');
}

const logoutAdmin = (req, res) => {
    req.session.isAuth = false;
    res.redirect('/login');
}

const isAuth = (req, res, next) => {
    if(req.session.isAuth == true)
        next();
    else
        res.redirect('/login');
}


module.exports = {
    createGame,
    savePhrases,
    loginAdmin,
    logoutAdmin,
    isAuth
}
