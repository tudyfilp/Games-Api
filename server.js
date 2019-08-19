const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

var NewUserValidator = require('./Firebase/NewUserValidator.js');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('New req');
    res.send("Hello there, we've been expecting you");
});

app.get('/doesUserExist', (req, res) => {

    let username = req.body.username;

    NewUserValidator.isValidUsername(username).then(result => 
        res.send(result)).catch(err => res.send(err));

});

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});