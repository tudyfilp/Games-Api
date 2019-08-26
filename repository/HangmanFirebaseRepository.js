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

    async checkLetter(sessionKey, letter) {
        let phrase = await this.getPhrase(sessionKey);
        let result = phrase.search(letter);
        if (result == -1) {
            return false;
        }
        return true;
    }

   async addUser(userKey,sessionKey){
        let path = this._sessionsPath;
        let user ={};
        user[userKey]={score:0};

        this._database.collection(path).doc(sessionKey).set({users: user }, { merge: true });
   }
}

module.exports = HangmanFirebaseRepository;


