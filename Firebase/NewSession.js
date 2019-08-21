const db = require('./Firestore');

class NewSession {
    static getSession(name) {
      

        return new Promise((res, rej) => {
            db.collection('games').where("name", "==", name).get().then(querySnapshot1 => {
                querySnapshot1.forEach((doc) => {
                    doc.ref.collection('sessions').where("availablePlaces",">",0).limit(1).get().then((querySnapshot2) => {

                        if(querySnapshot2.empty==true)
                            rej({
                                //create new session
                                key: "null"
                            });
                         else
                            res({
                                key: querySnapshot2.docs[0].id
                               });
                       }); })

                
            });
        }) 
        
     
    }
}


module.exports = NewSession;

