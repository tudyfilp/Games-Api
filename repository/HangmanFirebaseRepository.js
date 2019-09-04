const GamesFirebaseRepository = require('./GamesFirebaseRepository');
const HangmanModel = require('../model/HangmanModel');
const getRandomItem = require('../utilities/getRandomItem');
const isLetter = require('../utilities/isLetter');

class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db, validator) {
        super(db, 'games');

        this._gameKey = "78mzQLCv5fF6I1K1TnJU";

        this._sessionsPath = `games/${this._gameKey}/sessions`;

        this._phrasesPath = `games/${this._gameKey}/phrases`;

        this.model = new HangmanModel();

        this._validator = validator;
    }

    async addSession() {
        let randomSession = await this.getRandomSession();
        return await super.addSession(this._gameKey, randomSession);
    }

    setSession(sessionKey, sessionData) {

        return super.setSession(this._gameKey, sessionKey, sessionData);
    }

    getSessionByUserKey(userKey) {
        return super.getSessionByUserKey(this._gameKey, userKey);
    }

    getActiveUsers(sessionKey) {
        return super.getActiveUsers(this._gameKey, sessionKey);
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

        for (var pos in phrase) {
            if (!foundLetters.hasOwnProperty(phrase[pos]) && isLetter(phrase[pos]))
                foundLetters[phrase[pos]] = 1;
            else if (foundLetters.hasOwnProperty(phrase[pos]) && isLetter(phrase[pos]))
                foundLetters[phrase[pos]] = foundLetters[phrase[pos]] + 1;
        }

        session.phraseLetters = foundLetters;
    }

    setupCompletedPhrase(session) {

        let phrase = session.phrase;
        let completedPhrase = [];

        for (var pos in phrase) {
            if (isLetter(phrase[pos]))
                completedPhrase.push('');
            else
                completedPhrase.push(phrase[pos]);
        }

        session.completedPhrase = completedPhrase;
    }

    getSession(cb) {
        return super.getSession(this._gameKey, cb);
    }

    async setSentences(category, sentences) {
        let path = this._phrasesPath;

        this._database.collection(path).doc(category).set({ sentences }, { merge: true });
    }

    getPhrase(session) {
        return session.phrase;
    }

    getPhrasesByCategory() {
        let sentencesByCategory = {};
        return this._database.collection(`games/${this._gameKey}/phrases`).get().then(snapshot => {
            snapshot.forEach(doc => sentencesByCategory[doc.id] = doc.data());
            return Promise.resolve(sentencesByCategory);
        });
    }

    getRandomPhrase() {

        return this.getPhrasesByCategory().then(result => {

            let randomCategory = getRandomItem(Object.keys(result));

            let chosenSentence = getRandomItem(result[randomCategory].sentences);

            return Promise.resolve({ category: randomCategory, phrase: chosenSentence });

        });
    }

    async getSessionByKey(sessionKey) {

        return super.getSessionByKey(this._gameKey, sessionKey);

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
        let score = 100* (1/(session.phraseLetters[letter]));
        return score;
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
        let phrase = this.getCompletedPhrase(session.data);

        function isEmpty(letter) {
            return letter === "";
        }

        return phrase.find(isEmpty) != "";
    }

    endGame(session) {
        session.data.gameEnded = true;
    }

    increaseScore(userKey, session, letter) {

        let user = this.getUser(userKey, session);
        let points = this.getLetterScore(session, letter);

        session.users[userKey].score = user.score + points;

    }

    decreaseLives(userKey, session) {

        let user = this.getUser(userKey, session);
        if (session.users[userKey].lives > 0) {
            session.users[userKey].lives = user.lives - 1;
        }
        else return;

    }

    registerLetter(userKey, session, letter) {
        if (session.users[userKey].lives > 0) {
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

    isGameEnded(session) {
        return session.data.gameEnded;
    }

    async removeUserFromSession(userId, sessionId) {
        let session = await this.getSessionByKey(sessionId);

        if (session.data === undefined){
            throw new Error('There is no session having the given key.');
        }
            

        if (this._validator.isUserInSession(session, userId) === true) {
            session.data.activeUsers = session.data.activeUsers.filter(userKey => userKey !== userId);
            delete session.data.users[userId];
            
            session.data.availablePlaces += 1;

            await this.setSession(session.id, session.data);
        }
        else {
            throw new Error('The user is already out of this session.');
        }

        return session;
    }
}
module.exports = HangmanFirebaseRepository;


