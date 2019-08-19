
class UserValidator {
    
    static isUsernameValid(username) {
        if (typeof username === 'undefined') {
            throw new Error('The username is not a string of characters.');
        }

        if (username.length < 3 || username.length > 16) {
            throw new Error('The username must have between 3 and 16 characters');
        }

        return true;
    }
}

module.exports = UserValidator;