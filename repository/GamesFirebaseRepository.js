const FirebaseRepository = require('./FirebaseRepository');

class GamesFirebaseRepository extends FirebaseRepository {
    constructor(db,gameKey) {
        super(db, 'games');
        
        this._gameKey=gameKey;
    }

    getSessionsPath(gameKey){
        let path = "games/" + gameKey + "/sessions";
        return path;
    }
    async updateSession(gameKey,sessionKey,item){

        let path = this.getSessionsPath(gameKey);

        let documentRef = this._database.collection(path).doc(sessionKey);

        delete item.id;

        await documentRef.set(item, {merge: true});
    }

    async addSentence(gameKey,sessionKey){

       let sentence="Indiana";
 
       await this.updateSession(gameKey,sessionKey,{generatedSentence:sentence,availablePlaces:4});

       return "added";
    }

    async addSession(gameKey) {

        let path = this.getSessionsPath(gameKey);

        let documentRef = await this._database.collection(path).add({availablePlaces:4});

        return documentRef.id;
    }

   async getSession(gameKey,cb) { 

    let path = this.getSessionsPath(gameKey);

    this._database.collection(path)
                   .where("availablePlaces",">",0)
                   .limit(1)
                   .get()
                   .then((querySnapshot) => {
                        if(querySnapshot.empty === true) 
                        {    
                            this.addSession(key).then((result)=>cb(result));
                        }
                       else
                       {  
                           cb(querySnapshot.docs[0].id) ;
                       }

                   });
   }

}

module.exports = GamesFirebaseRepository;