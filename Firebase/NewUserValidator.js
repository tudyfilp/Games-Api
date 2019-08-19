const db = require('./Firestore');

class NewUserValidator {
    static isValidUsername(username) {
        
        return new Promise((res, rej) => {
            db.collection('users').where("username", "==", username)
            .get().then(querySnapshot => {

                if(!querySnapshot.empty)
                    rej({
                        isValid: false,
                        errorMessage: 'User already exists, try another one'
                    });
                else
                    res({
                        isValid: true
                    });
            });
        })

    }
}

module.exports = NewUserValidator;

