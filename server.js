const express = require('express');
const cors = require('cors');
const app = express();
var cookieSession = require('cookie-session');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
var NewUserValidator = require('./Firebase/NewUserValidator.js');
var adminRouter = require('./routers/admin');
require('custom-env').env(true);

io.origins('*:*');

const PORT = process.env.PORT || 3000;

const userService = require('./service/userService');
const gamesService = require('./service/gamesService');
const adminService = require('./service/adminService');

const path = require('path');
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(cookieSession({
    name: 'session',
    keys: ['key1']
}));

app.use(express.static('public'));
app.use('/gamesThumbnails', express.static('images'));

app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("Hello there, we've been expecting you");
});

app.get('/login', (req, res) =>{
    res.sendFile(path.resolve(__dirname + '/public/admin/adminLogin.html'));
});

app.post('/login', adminService.loginAdmin)

app.get('/doesUserExist', (req, res) => {

    let username = req.body.username;

    NewUserValidator.isValidUsername(username).then(result => 
        res.send(result)).catch(err => res.send(err));
});

app.post('/authenticateUser', userService.authenticateUser);

app.post('/getSession', gamesService.getSession);

app.post('/setSessionField', gamesService.setSessionField);

app.post('/getAllGames', gamesService.getAllGames);

app.post('/setSentences', gamesService.setSentences);

let names = [];
io.on('connection', (socket) => {

    socket.emit('nameChange', names);

    socket.on('addName', (name) => {
        names.push(name);
        
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
    console.log(process.env.ADMIN_PASSWORD);
});