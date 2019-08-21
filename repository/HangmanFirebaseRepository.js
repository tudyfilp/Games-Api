const GamesFirebaseRepository = require('./GamesFirebaseRepository');

class HangmanFirebaseRepository extends GamesFirebaseRepository {
    constructor(db) {
        super(db, 'games');
        
        this._gameKey = "8jmng49yYAUjO8nyDU03";

        this._sessionsPath ="games/8jmng49yYAUjO8nyDU03/sessions";

        this._categoriesPath="games/8jmng49yYAUjO8nyDU03/categories";
        
    }

    async updateCategory(categoryKey,item){

        let path = this._categoriesPath;

        let documentRef = this._database.collection(path).doc(categoryKey);

        delete item.id;

        await documentRef.set(item, {merge: true});
    }

    async addCategory() {

        let path = this._categoriesPath;

        let documentRef = await this._database.collection(path).add({name:"new category"});

        return documentRef.id;
    }

    async addSentence(categoryKey,item){

        await this.updateCategory(categoryKey,item);
    
        return "added";
     }

}

module.exports = HangmanFirebaseRepository;