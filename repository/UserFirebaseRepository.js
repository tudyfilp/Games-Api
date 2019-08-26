const FirebaseRepository = require('./FirebaseRepository');

class UserFirebaseRepository extends FirebaseRepository {
    constructor(db, userValidator) {
        super(db, 'users');

        this._validator = userValidator;
    }

    async usernameExists(username) {
        let users = await this.query("username", "==", username);

        return users.size > 0;
    }

    async getUserIdByName(username) {
        let users = await this.query("username", "==", username);
        //console.log(users.docs[0].id);

        return users.docs[0].id;
    }

    async addUser(username) {

        if (this._validator.isUsernameValid(username) === true) {
            let user = {
                username: username
            };

            let userId = null;
            
            if (await this.usernameExists(username) === true) {
                userId = await this.getUserIdByName(username);
            }
            else {
                userId = await this.add(user);
            }

            //console.log(userId);

            user.id = userId;

            return user;
        }
    }
}

module.exports = UserFirebaseRepository;