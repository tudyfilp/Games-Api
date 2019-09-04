const db = require('../Firebase/Firestore');
const UserFirebaseRepository = require('../repository/UserFirebaseRepository');
const UserValidator = require('../validator/UserValidator');

const repository = new UserFirebaseRepository(db, UserValidator);

const authenticateUser = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let response;

    if (req.body.hasOwnProperty('username') === true) {
        try {
            let user = await repository.addUser(req.body.username);
            
            response = {
                status: 'OK',
                message: user
            };
        }
        catch(e) {
            response = {
                status: 'ERROR',
                message: e.message
            };
        }
    }
    else {
        response = {
            status: 'ERROR',
            message: 'No username was supplied.'
        };
    }

    res.end(JSON.stringify(response));
};

module.exports = {
    authenticateUser: authenticateUser
};