const FirebaseRepository = require('./FirebaseRepository');

class UserFirebaseRepository extends FirebaseRepository {
    constructor(db, userValidator) {
        super(db, 'users');

        this._validator = userValidator;
    }

    async addUser(username) {

        if (this._validator.isUsernameValid(username) === true) {
            let user = {
                username: username
            };

            let userId = await this.add(user);

            user.id = userId;

            return user;
        }
    }
}

module.exports = UserFirebaseRepository;