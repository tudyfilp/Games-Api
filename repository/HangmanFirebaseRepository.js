const GamesFirebaseRepository = require('./GamesFirebaseRepository');
const HangmanModel = require('../model/HangmanModel');

class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');
        
        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath ="games/8jmng49yYAUjO8nyDU03/sessions";

        this._phrasesPath="games/8jmng49yYAUjO8nyDU03/phrases";

        this.model = new HangmanModel();
    } 

    async addSession() {
        super.addSession(this.model.session);
    }

    async setSentences(category, sentences) {

        let path = this._phrasesPath;

        this._database.collection(path).doc(category).set({ sentences } ,{ merge : true });
    }

  async getPhrase(sessionKey) {
        let docRef = await this._database.collection(this._sessionsPath).doc(sessionKey).get();
        return docRef.data().phrase;
   }

   async checkLetter(sessionKey,letter) { 
       let phrase = await this.getPhrase(sessionKey);
       let result = phrase.search(letter);
       if(result == -1){
           return false;
       }
       return true;
    }

   async increaseScore(userKey,letter) { 
    //  let docRef = await this._database.collection(this._sessionsPath).doc(sessionKey).get();

    //  console.log(docRef.data().phrase);

     return true;
     }
}

module.exports = HangmanFirebaseRepository;


