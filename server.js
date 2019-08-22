const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
io.origins('*:*');

var NewUserValidator = require('./Firebase/NewUserValidator.js');
 
const PORT = process.env.PORT || 3000;

const userService = require('./service/userService');
const gamesService = require('./service/gamesService');
const hangmanService = require('./service/hangmanService');

app.use(cors());

// app.use(cors({
//     origin: function(origin, callback){
//         // allow requests with no origin 
//         // (like mobile apps or curl requests)
//         var allowedOrigins = ['http://localhost:8080', 'http://localhost:3000'];

//         if(!origin) {
//             return callback(null, true);
//         }

//         if(allowedOrigins.indexOf(origin) === -1){
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }

//         return callback(null, true);
//     }
// }));

app.use(bodyParser.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    console.log('New req');
    res.send("Hello there, we've been expecting you");
});

app.get('/doesUserExist', (req, res) => {

    let username = req.body.username;

    NewUserValidator.isValidUsername(username).then(result => 
        res.send(result)).catch(err => res.send(err));
});

app.post('/authenticateUser', userService.authenticateUser);

app.post('/getSession', gamesService.getSession);

app.post('/setSessionField', gamesService.setSessionField);

app.post('/getAllGames', gamesService.getAllGames);

app.post('/setSentences', hangmanService.setSentences);

let names = [];
io.on('connection', (socket) => {

    socket.emit('nameChange', names);

    socket.on('addName', (name) => {
        names.push(name);

        console.log(names);
        
        io.emit('nameChange', names);
    });

    socket.on('deleteName', (index) => {
        names.splice(index, 1);

        io.emit('nameChange', names);
    });
    //console.log(socket);
});

server.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});