const GamesFirebaseRepository = require('./GamesFirebaseRepository');
const HangmanModel = require('../model/HangmanModel');
const getRandomItem = require('../utilities/getRandomItem');
const isLetter = require('../utilities/isLetter');
class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');

        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath = "games/8jmng49yYAUjO8nyDU03/sessions";

        this._phrasesPath = "games/8jmng49yYAUjO8nyDU03/phrases";

        this.model = new HangmanModel();
    } 

    async addSession() {

        return await super.addSession(this._gameKey, await this.getRandomSession());
    }

    async getRandomSession() {

        let phraseInfo = await this.getRandomPhrase();
        let session = Object.assign({}, this.model.session);

        session.phrase = phraseInfo.phrase;
        session.phraseCategory = phraseInfo.category;

        this.addPhraseLetters(session);
        this.setupCompletedPhrase(session);
        return session;
    }

    addPhraseLetters(session) {
        let foundLetters = {};
        let phrase = session.phrase;

        for(var pos in phrase) {
            if(!foundLetters.hasOwnProperty(phrase[pos]) && isLetter(phrase[pos]))
                foundLetters[phrase[pos]] = 1;
            else if (foundLetters.hasOwnProperty(phrase[pos]) && isLetter(phrase[pos]))
                foundLetters[phrase[pos]] = foundLetters[phrase[pos]] + 1;
        }

        session.phraseLetters = foundLetters;
    }

    setupCompletedPhrase(session) {

        let phrase = session.phrase;
        let completedPhrase = [];

        for(var pos in phrase) {
            if(isLetter(phrase[pos]))
                completedPhrase.push('');
            else
                completedPhrase.push(phrase[pos]);
        }

        session.completedPhrase = completedPhrase;
    }
    
    getSession(cb) {
        return super.getSession(this._gameKey, cb);
    }
    async addSession() {
        return await super.addSession(this._gameKey, this.model.session);
    }

    async setSentences(category, sentences) {
        let path = this._phrasesPath;

        this._database.collection(path).doc(category).set({ sentences }, { merge: true });
    }

    getPhrase(session) {
        return session.phrase;
    }

    getPhrasesByCategory(){
        let sentencesByCategory = {};
        return this._database.collection(`games/${this._gameKey}/phrases`).get().then(snapshot => {
            snapshot.forEach(doc => sentencesByCategory[doc.id] = doc.data());
            return Promise.resolve(sentencesByCategory);
        });
    }

    getRandomPhrase(){

        return this.getPhrasesByCategory().then(result => {

            let randomCategory = getRandomItem(Object.keys(result));

            let chosenSentence = getRandomItem(result[randomCategory].sentences);
            
            return Promise.resolve({category: randomCategory, phrase: chosenSentence});
            
        });
    }
    
    async getSessionByKey(sessionKey) {
        let path = "games/" + this._gameKey + "/sessions";

        return await this._database.collection(path).doc(sessionKey).get().then((r) => { return r.data() });
    }
    async getSessionDataByKey(sessionKey) {
        let path = "games/" + this._gameKey + "/sessions";

        return await this._database.collection(path).doc(sessionKey).get().then((session) => { return session.data() });
    }

    checkLetter(sessionKey, letter) {
        let phrase = this.getPhrase(sessionKey);

        let result = phrase.search(letter);

        if (result == -1) {
            return false;
        }

        return true;
    }

    addUser(userKey, session) {
        session.users[userKey] = { lives: 4, score: 0 };
    }

    getUser(userKey, session) {
        return session.users[userKey];
    }

    getLetterScore(session, letter) {
        return session.phraseLetters[letter];
    }

    addGuessedLetter(session, letter) {
        session.guessedLetters.push(letter);
    }
    isLetterGuessed(session, letter) {

        let guessedLetters = session.guessedLetters;

        for (var i = 0; i < guessedLetters.length; i++) {

            if (guessedLetters[i] === letter) {

                return true;
            }
        }
        return false;
    }

    getCompletedPhrase(session) {
        return session.completedPhrase;
    }

    setCompletedPhrase(session, newCompletedPhrase) {
        session.completedPhrase = newCompletedPhrase;
    }

    updateCompletedPhrase(session, letter) {
        let completedPhrase = this.getCompletedPhrase(session);
        let phrase = this.getPhrase(session);

        for (var i = 0; i < phrase.length; i++) {
            if (phrase[i] === letter) {
                completedPhrase[i] = letter;
            }
        }
        this.setCompletedPhrase(session, completedPhrase);
    }

    isPhraseComplete(session) {
        let phrase = this.getCompletedPhrase(session);

        function isEmpty(letter) {
            return letter === "";
        }

        return phrase.find(isEmpty) != "";
    }

    isGameEnded(session) {
        let isComplete = this.isPhraseComplete(session);

        if (isComplete === true) {
            session.gameEnded = true;
            return session;
        }
        return session;
    }
    
    increaseScore(userKey, session, letter) {

        let user = this.getUser(userKey, session);
        let points = this.getLetterScore(session, letter);

        session.users[userKey].score = user.score + points;
        session.users[userKey].lives = user.lives;

    }


    decreaseLives(userKey, session) {

        let user =this.getUser(userKey, session);

        session.users[userKey].score = user.score;
        session.users[userKey].lives = user.lives - 1;

    }

    registerLetter(userKey, session, letter) {

            if (this.isLetterGuessed(session, letter) === false) {
                if (this.checkLetter(session, letter) === true) {
                    this.increaseScore(userKey, session, letter);
                    this.addGuessedLetter(session, letter);
                    this.updateCompletedPhrase(session, letter);
                }
                else {
                    this.decreaseLives(userKey, session);
                }
            }
        else return;
    }
}

module.exports = HangmanFirebaseRepository;


