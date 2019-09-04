class HangmanValidator {
    static isUserInSession(session, userId) {
        let userIndex = session.data.activeUsers.indexOf(userId);

        return userIndex > -1;
    }
}

module.exports = HangmanValidator;