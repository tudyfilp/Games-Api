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

    async getPhrase(sessionKey) {
        let docRef = await this._database.collection(this._sessionsPath).doc(sessionKey).get();
        return docRef.data().phrase;
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

        return await this._database.collection(path).doc(sessionKey).get().then((session) => { return session.data() });
    }

    async checkLetter(sessionKey, letter) {
        let phrase = await this.getPhrase(sessionKey);
        let result = phrase.search(letter);
        if (result == -1) {
            return false;
        }
        return true;
    }

    async addUser(userKey, sessionKey) {
        let path = this._sessionsPath;
        let user = {};
        user[userKey] = { lives: 4, score: 0 };

        this._database.collection(path).doc(sessionKey).set({ users: user }, { merge: true });
    }
    async getUserInfo(userKey, sessionKey) {
        let path = this._sessionsPath;

        return await this._database.collection(path).doc(sessionKey).get().then((d) => { return d.data().users[userKey] });
    }

    async increaseScore(userKey, sessionKey) {
        let path = this._sessionsPath;
        //getUserInfo
        let user = {};
        let obj = {};
        obj.lives = 4;
        obj.score = 0;
        user[userKey] = obj;
        console.log(JSON.stringify(user));
        this._database.collection(path).doc(sessionKey).set({ users: user }, { merge: true });
    }
    async decreaseLives(userKey, sessionKey) {

    }
}

module.exports = HangmanFirebaseRepository;


