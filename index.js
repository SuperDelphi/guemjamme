const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const uuid4 = require('uuid4');

const User = require('./js/classe/User');
const Room = require('./js/classe/Room');
const Game = require('./js/classe/Game');

const { roomCode, codeExists} = require('./js/functions');

global.rooms = {}



app.use(express.static(__dirname+'/'));

/**
 * Page d'acceuil du site + page pour créer un room
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

/**
 * Page de jeu principale
 */
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game.html');
});

/**
 * Page pour rejoindre une room
 */
app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/views/join.html');
});


io.on('connection', socket => {
    /**
     * Demande d'un client pour créer une nouvelle room
     */
    socket.on('host_room', (preferences, name, color, avatar) => {
        const uuid = uuid4();
        const owner = new User(uuid, name, color, avatar);

        let code = roomCode();
        if (codeExists(code)) {
            code = roomCode();
        }

        const room = new Room(code, owner, preferences);
        const game = new Game(code, preferences.gameDuration, preferences.wordAmount);
        room.setGame(game)

        global.rooms[code] = room;
        socket.join(code)
        console.log(room)
        io.sockets.in(code).emit('success_host_room', code, uuid)
    });

    /**
     * Lorsqu'un client arrive sur la page /game de ssa room
     */
    socket.on('join', (code, uuid) => {
        console.log(code, global.rooms[code])
        socket.join(code)
        io.sockets.in(code).emit('new_join', global.rooms[code]);
    })

    /**
     * Demande d'un client pour verifier l'existence d'une room
     */
    socket.on('exist_room', (code, name, color, avatar) => {
        if (!global.rooms[code]) return;

        const uuid = uuid4();
        const newUser = new User(uuid, name, color, avatar);

        global.rooms[code].addUser(newUser);

        socket.join(code);
        io.sockets.in(code).emit('room_exist', code, uuid);
    })
});


server.listen(3000, () => {
    console.log('server running on port 3000')
});