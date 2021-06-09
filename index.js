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

            const room = new Room(code, owner, response.p);
            socket.emit('host_success', {owner, code});
            global.rooms[code] = room;

            socket.disconnect(true);
        });
    });
});

/**
 * Page de jeu principale
 */
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game.html');

    io.on('connection', (socket) => {
        socket.on('check_room', res => {
            const room = global.rooms[res.code];

            if (room === undefined) return;
            if (!room.hasUser(res.uuid)) return;


            const game = new Game(res.code, room.getPreferences().gameDuration, room.getPreferences().wordAmound);
            room.setGame(game);
            socket.emit('check_room_success', room);
        })

        socket.on('start_game', () => {
            game.sta
        })

    });
});

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/views/join.html');
});

server.listen(3000, () => {
    console.log('server running on port 3000')
});