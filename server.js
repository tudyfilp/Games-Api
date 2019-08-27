const express = require('express');
const cors = require('cors');
const app = express();
var cookieSession = require('cookie-session');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
var adminRouter = require('./routers/admin');
var sessionRouter = require('./routers/session');
require('custom-env').env(true);

io.origins('*:*');
require('./sockets/socket')(io);

const PORT = process.env.PORT || 3000;

const userService = require('./service/userService');
const gamesService = require('./service/gamesService');
const adminService = require('./service/adminService');
const hangmanService = require('./service/hangmanService');

const path = require('path');
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieSession({
    name: 'session',
    keys: ['key1']
}));

app.use(express.static('public'));
app.use('/gamesThumbnails', express.static('images'));

app.use('/admin', adminRouter);
app.use('/getSession', sessionRouter);

app.get('/', (req, res) => {
    res.send("Hello there, we've been expecting you");
});

app.get('/login', (req, res) =>{
    res.sendFile(path.resolve(__dirname + '/public/admin/adminLogin.html'));
});

app.post('/login', adminService.loginAdmin)

app.post('/authenticateUser', userService.authenticateUser);

app.post('/setSessionField', gamesService.setSessionField);

app.get('/getAllGames', gamesService.getAllGames);

app.post('/getGameData', gamesService.getGameData);

app.post('/setSentences', hangmanService.setSentences);

server.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});