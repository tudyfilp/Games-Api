const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var NewUserValidator = require('./Firebase/NewUserValidator.js');
var adminRouter = require('./routers/admin');

io.origins('*:*');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("Hello there, we've been expecting you");
});

app.get('/doesUserExist', (req, res) => {

    let username = req.body.username;

    NewUserValidator.isValidUsername(username).then(result => 
        res.send(result)).catch(err => res.send(err));

});

io.on('connection', (socket) => {
    socket.broadcast.emit('broadcast', "hello there, new user!");

    socket.on("newMessage", (message) => {
        socket.broadcast.emit("receivedMessage", message);
    })
});

server.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});