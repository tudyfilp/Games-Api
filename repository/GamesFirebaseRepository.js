const FirebaseRepository = require('./FirebaseRepository');
const GameModel = require('../model/GameModel');

class GamesFirebaseRepository extends FirebaseRepository {
    constructor(db) {
        super(db, 'games');
        this.model = new GameModel();
    }

    async getGameData(gameId) {
        let gameData = await this.getItemById(gameId);

        if (gameData === undefined) {
            throw new Error('No game could be found.');
        }

        gameData.id = gameId;

        return gameData;
    }

    async setSession(gameKey, sessionKey, item) {

        let path = "games/" + gameKey + "/sessions";

        let documentRef = this._database.collection(path).doc(sessionKey);

        //delete item.id;

        await documentRef.set(item, { merge: true });
    }

    async addSession(gameKey, session) {
        let path = "games/" + gameKey + "/sessions";

        let documentRef = await this._database.collection(path).add(session);

        return await this._database.collection(path).doc(documentRef.id).get()
            .then((doc) => {
                return {
                    sessionData: doc.data(),
                    sessionId: doc.id
                }
            });

    }

    async setSessionField(gameKey, sessionKey, item) {

        await this.setSession(gameKey, sessionKey, item);

        return "added";
    }

    async getSessionByKey(gameKey, sessionKey) {

        let path = "games/" + gameKey + "/sessions";
        let docRef = await this._database.collection(path).doc(sessionKey).get();

        return {
            data: docRef.data(),
            id: docRef.id
        };
    }

    async getUsers(sessionKey) {

        let session = await this.getSessionByKey(sessionKey);
        
        return session.data.users;

    }

    async isUserInSession(userKey, sessionKey) {
        let users = await this.getUsers(sessionKey);

        if (users[userKey])
            return true;
        return false;
    }

    async getArrayOfSessions(gameKey) {
        let sessionsPath = "games/" + gameKey + "/sessions";
        const snapshot = await this._database.collection(sessionsPath).get()
        return snapshot.docs.map(doc => {
            return {
                sessionId: doc.id, 
                sessionData: doc.data()
            }
        });
    }

    checkNested(obj, userKey,  ...rest) {
        if (obj === undefined) return false
        if (rest.length == 0 && obj.hasOwnProperty(userKey)) return true
        return this.checkNested(obj[userKey], ...rest)
      }

    async getSessionByUserKey(gameKey, userKey) {

        let sessionsArray= await (this.getArrayOfSessions(gameKey));

        for(let i = 0; i < sessionsArray.length; i++){

            let result = this.checkNested(sessionsArray[i].sessionData.users,userKey);

            if(result === true && sessionsArray[i].sessionData.gameEnded === false) {
                return sessionsArray[i];
            }; 
        }
        return null;
    }

    getSession(gameKey, cb) {

        let path = "games/" + gameKey + "/sessions";
   
        this._database.collection(path)
            .where("availablePlaces", ">", 0)
            .where('gameEnded', "==", false)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty === true) {
                    cb(null);
                }
                else {

                    cb({
                        sessionData: querySnapshot.docs[0].data(),
                        sessionId: querySnapshot.docs[0].id
                    });

                }

            });
    }

}

module.exports = GamesFirebaseRepository;