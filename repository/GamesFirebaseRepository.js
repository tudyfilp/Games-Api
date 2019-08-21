const FirebaseRepository = require('./FirebaseRepository');

class GamesFirebaseRepository extends FirebaseRepository {
    constructor(db) {
        super(db, 'games');
    }

    async addSession(key) {
        
        let path = "games/" + key + "/sessions";

        let documentRef = await this._database.collection(path).add({availablePlaces:4});

        return documentRef.id;
    }

   async getSession(key,cb) { 

     let path = "games/" + key + "/sessions";

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