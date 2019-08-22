const db = require('../Firebase/Firestore');
const UserFirebaseRepository = require('../repository/UserFirebaseRepository');
const UserValidator = require('../validator/UserValidator');

const repository = new UserFirebaseRepository(db, UserValidator);

const authenticateUser = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.body.hasOwnProperty('username') === true) {
        try {
            let user = await repository.addUser(req.body.username);
            
            res.end(JSON.stringify(
                {
                    status: 'OK',
                    message: user
                }
            ));
        }
        catch(e) {
            res.end(JSON.stringify(
                {
                    status: 'ERROR',
                    message: e.message
                }
            ));
        }
    }
    else {
        res.end(JSON.stringify(
            {
                status: 'ERROR',
                message: 'No username was supplied.'
            }
        ));
    }
};

module.exports = {
    authenticateUser: authenticateUser
};