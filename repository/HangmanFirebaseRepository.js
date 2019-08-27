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

    async getPhrase(sessionKey) {
        let docRef = await this._database.collection(this._sessionsPath).doc(sessionKey).get();
        return docRef.data().phrase;
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


