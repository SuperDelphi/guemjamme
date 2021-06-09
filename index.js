const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const uuid4 = require('uuid4');

const User = require('./js/classe/User');
const Room = require('./js/classe/Room');

const { roomCode, codeExists} = require('./js/functions');

global.rooms = {}

app.use(express.static(__dirname+'/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');

    io.on('connection', socket => {
        socket.on('host_room', response => {
            const owner = new User(uuid4(), response.name, response.color, response.avatar);

            let code = roomCode();
            if (codeExists(code)) {
                code = roomCode();
            }

            const room = new Room(code, owner);
            global.rooms[code] = room;

            socket.emit('host_success', owner);

            socket.disconnect(true);
        });
    });
});


app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game.html');
});

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/views/join.html');
});

server.listen(3000, () => {
    console.log('server running on port 3000')
});