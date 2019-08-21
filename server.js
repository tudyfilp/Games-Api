const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
var NewUserValidator = require('./Firebase/NewUserValidator.js');
var adminRouter = require('./routers/admin');

io.origins('*:*');

const PORT = process.env.PORT || 3000;

const userService = require('./service/userService');

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("Hello there, we've been expecting you");
});

app.get('/doesUserExist', (req, res) => {

    let username = req.body.username;

    NewUserValidator.isValidUsername(username).then(result => 
        res.send(result)).catch(err => res.send(err));
});

app.post('/authenticateUser', userService.authenticateUser);

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