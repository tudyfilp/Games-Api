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

    async getUsername(userKey) {

        let docRef = await this._database.collection("users").doc(userKey).get();

        return docRef.data().username;

    }

    async isUserInSession(userKey, sessionKey) {
        let users = await this.getUsers(sessionKey);

        if (users[userKey])
            return true;
        return false;
    }

    async getSessionByUserKey(gameKey, userKey) {

        let path = "games/" + gameKey + "/sessions";

        return this._database.collection(path)
            .where("activeUsers", "array-contains", userKey)
            .where("gameEnded", "==", false).get().then((res) => {
            if (!res.empty) {
                return ({ sessionData: res.docs[0].data(), sessionId: res.docs[0].id });
            }
            
            return null;
        });
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