const FirebaseRepository = require('./FirebaseRepository');

class GamesFirebaseRepository extends FirebaseRepository {
    constructor(db) {
        super(db, 'games');
    }
    async addSession(key) {
        let str="games/"+key+"/sessions";
        let documentRef = await this._database.collection(str).add({availablePlaces:4});
    
        return documentRef.id;
    }

   async getSession(key,cb) { 

     this._database.collection('games').doc(key).collection('sessions')
                   .where("availablePlaces",">",0)
                   .limit(1)
                   .get()
                   .then((querySnapshot2) => {
                       if(querySnapshot2.empty === true) {    

                           this.addSession(key).then((result)=>cb(result));
                       }
                       else
                       {  
                           cb(querySnapshot2.docs[0].id) ;
                       }

               });
           
       }

}

module.exports = GamesFirebaseRepository;