const GamesFirebaseRepository = require('./GamesFirebaseRepository');
const HangmanModel = require('../model/HangmanModel');

class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');

        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath = "games/8jmng49yYAUjO8nyDU03/sessions";

        this._phrasesPath = "games/8jmng49yYAUjO8nyDU03/phrases";

        this.model = new HangmanModel();
    }
    async getSession(cb) {
        return await super.getSession(this._gameKey, cb);
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
    async getSessionByKey(sessionKey) {
        
        let path = "games/" + this._gameKey + "/sessions";
        let docRef = await this._database.collection(path).doc(sessionKey).get();
        
        return docRef.data();
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

        return session.guessedLetters.includes(letter);

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

    }


    decreaseLives(userKey, session) {

        let user = this.getUser(userKey, session);

        session.users[userKey].lives = user.lives - 1;

    }

    registerLetter(userKey, session, letter) {

            if (!this.isLetterGuessed(session, letter)) {
                if (this.checkLetter(session, letter)) {
                    this.increaseScore(userKey, session, letter);
                    this.addGuessedLetter(session, letter);
                    this.updateCompletedPhrase(session, letter);
                }
                else {
                    this.decreaseLives(userKey, session);
                }
            }
    }
}

module.exports = HangmanFirebaseRepository;


