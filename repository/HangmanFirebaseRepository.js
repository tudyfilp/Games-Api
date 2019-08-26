const GamesFirebaseRepository = require('./GamesFirebaseRepository');
const HangmanModel = require('../model/HangmanModel');
const getRandomItem = require('../utilities/getRandomItem');
const isLetter = require('../utilities/isLetter');
class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');
        
        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath ="games/8jmng49yYAUjO8nyDU03/sessions";

        this._phrasesPath="games/8jmng49yYAUjO8nyDU03/phrases";

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

    async setSentences(category, sentences) {

        let path = this._phrasesPath;

        this._database.collection(path).doc(category).set({ sentences } ,{ merge : true });
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
}

module.exports = HangmanFirebaseRepository;


