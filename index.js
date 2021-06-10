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
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');

    io.on('connection', socket => {
        console.log('test')
        socket.on('host_room', res => {
            const uuid = uuid4();
            const owner = new User(uuid, res.name, res.color, res.avatar);

            let code = roomCode();
            if (codeExists(code)) {
                code = roomCode();
            }

            global.rooms[code] = new Room(code, owner, res.p);
            console.log(socket.rooms)
            socket.join(code)
            console.log(socket.rooms)
            io.sockets.in(code).emit('success_host_room', {code: code, uuid: uuid, room: global.rooms[code]})
        });

        socket.on('new_user_join', (res) => {
            socket.join(res.Sroom)
            io.sockets.in(res.Sroom).emit('new_user_join', res.room);
        })
    });

    /*io.on('connection', socket => {
        socket.on('host_room', response => {
            const owner = new User(uuid4(), response.name, response.color, response.avatar);

            let code = roomCode();
            if (codeExists(code)) {
                code = roomCode();
            }

            const room = new Room(code, owner, response.p);
            global.rooms[code] = room;
            socket.join(code)
            socket.emit('host_success', {owner, code});

            socket.disconnect(true);
        });
    });*/
});

/**
 * Page de jeu principale
 */
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game.html');

    /*io.on('connection', (socket) => {
        socket.on('check_room', res => {
            const room = global.rooms[res.code];

            if (room === undefined) return;
            if (!room.hasUser(res.uuid)) return;


            const game = new Game(res.code, room.getPreferences().gameDuration, room.getPreferences().wordAmound);
            room.setGame(game);
            socket.join(room.getCode())
            socket.emit('check_room_success', room);
        })

        socket.on('start_game', () => {

        })

    });*/
});

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/views/join.html');

        /*socket.on('check_room', res => {
            const room = global.rooms[res.code];

            if (room === undefined) return;
            if (room.isFull()) return;

            const user = new User(uuid4(), res.name, 'rose', res.avatar);
            room.addUser(user);

            socket.join(room.getCode())
            socket.emit('join_success', {room, user});
            socket.to(room.getCode()).emit('new_user', room)

            socket.disconnect(true);
        })*/
});





server.listen(3000, () => {
    console.log('server running on port 3000')
});