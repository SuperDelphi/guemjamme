const express = require('express');
const app = express();

const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const uuid4 = require('uuid4');

const User = require('./js/classe/User');
const Room = require('./js/classe/Room');
const Game = require('./js/classe/Game');

const RoomFactory = require('./js/factories/RoomFactory');
const RF = new RoomFactory();

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
        socket.join(code);
        socket.emit('success_host_room', code, uuid);
    });

    /**
     * Lorsqu'un client arrive sur la page /game de sa room
     */
    socket.on('join', (code, uuid) => {
        const game = global.rooms[code].getGame();
        game.addUser(uuid);

        console.log(game)

        global.rooms[code].setGame(game)

        socket.join(code);
        io.sockets.in(code).emit('new_join', global.rooms[code]);
    })

    /**
     * Demande du client pour récupérer une room à jours
     */
    socket.on('update_room', (code, room) => {
        const pre_room = global.rooms[code];
        const new_room = RF.getFromSocket(room);

        console.log(pre_room.users)

        pre_room.setPreferences(new_room.getPreferences());

        const pre_game = pre_room.getGame();
        const new_game = new_room.getGame();

        for (const key in new_game.getUsers()) {
            if (pre_game.hasOwnProperty(key)) return;
            pre_game.addUser(key, new_game.getUserGameStats(key));
        }

        console.log(pre_room.users)

        socket.join(code);
        io.sockets.in(code).emit('updated_room', global.rooms[code]);
    });

    /**
     * Demande d'un client pour verifier l'existence d'une room
     */
    socket.on('exist_room', (code) => {
        /* Si la room n'existe pas */
        if (!global.rooms[code]) return socket.emit('no_room');
        /* Si il n'y a plus de place dans la room (> 6) */
        if (global.rooms[code].getNbUsers() >= 6) return socket.emit('no_place')

        /* On attribut la couleur en fonction du nombre de joueurs dans la room (par default le premier est jaune) */
        let color
        console.log(global.rooms[code].getNbUsers())
        switch (global.rooms[code].getNbUsers()) {
            case 1:
                color = 'pink';
                break;
            case 2:
                color = 'purple';
                break;
            case 3:
                color = 'blue';
                break;
            case 4:
                color = 'green';
                break;
            case 5:
                color = 'brown';
                break;
        }

        socket.emit('room_exist', color);
    })

    /**
     * Demande du client pour créer un nouvel utilisateur
     */
    socket.on('create_user', (code, name, color, avatar) => {
        const uuid = uuid4();
        const newUser = new User(uuid, name, color, avatar);

        global.rooms[code].addUser(newUser);

        socket.join(code);
        socket.emit('created_user', code, uuid);
    });
});


server.listen(3000, () => {
    console.log('server running on port 3000')
});