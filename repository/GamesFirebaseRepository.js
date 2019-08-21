const FirebaseRepository = require('./FirebaseRepository');

class GamesFirebaseRepository extends FirebaseRepository {
    constructor(db,gameKey) {
        super(db, 'games');
        
        this._gameKey = gameKey;

        this._sessionsPath ="games/" + gameKey + "/sessions";
    }

   
    async setSession(sessionKey,item){

        let path = this._sessionsPath;

        let documentRef = this._database.collection(path).doc(sessionKey);

        delete item.id;

        await documentRef.set(item, {merge: true});
    }

    async addSession() {

        let path = this._sessionsPath;

        let documentRef = await this._database.collection(path).add({availablePlaces:4});

        return documentRef.id;
    }

    async setSessionField(sessionKey,item){

        await this.setSession(sessionKey,item);
    
        return "added";
     }
    
   async getSession(cb) { 

        let path = this._sessionsPath;

        this._database.collection(path)
                   .where("availablePlaces",">",0)
                   .limit(1)
                   .get()
                   .then((querySnapshot) => {
                        if(querySnapshot.empty === true) 
                        {    
                            this.addSession(this._gameKey).then((result)=>cb(result));
                        }
                       else
                       {  
                           cb(querySnapshot.docs[0].id) ;
                       }

                   });
   }

}

module.exports = GamesFirebaseRepository;