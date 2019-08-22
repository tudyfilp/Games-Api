const GamesFirebaseRepository = require('./GamesFirebaseRepository');

class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');
        
        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath ="games/8jmng49yYAUjO8nyDU03/sessions";

        this._phrasesPath="games/8jmng49yYAUjO8nyDU03/phrases";
        
    }

    async setSentences(category,sentences) {

        let path = this._phrasesPath;

        let obj = {};
        obj[category] = sentences;

        await this._database.collection(path).doc("tv7tz0Hd1OgFW0d1wmXR").set(obj,{merge:true});

        return "tv7tz0Hd1OgFW0d1wmXR";
    }

}

module.exports = HangmanFirebaseRepository;