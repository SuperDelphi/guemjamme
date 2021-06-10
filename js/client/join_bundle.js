(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Status = {
    WAITING: 1,
    PLAYING: 0,
    ENDED: -1
}

class Game {
    roomCode
    status
    words
    users
    duration
    endtime
    timeleft

    constructor(roomCode, duration, wordAmount) {
        this.roomCode = roomCode;
        this.status = Status.WAITING;
        this.words = [];

        this.duration =  duration;
        this.endtime = Date.now() + 1000 * this.duration;
        this.timeleft = this.endtime - Date.now();

        this.wordAmount = wordAmount;

        this.users = {}
    }

    startGame = () => {
        this.status = Status.PLAYING;
    }

    setWords = (words, amount) => {
        // TODO: maybe API request
        this.words = words;
    }

    getWords = () => {
        return this.words;
    }
}

module.exports = Game;
},{}],2:[function(require,module,exports){
class Room {
    code
    owner
    // Object with {wordAmount, gameDuration}
    preferences
    users
    game
    MAX_CAPACITY = 6

    constructor(code, owner, preferences) {
        this.code = code;
        this.owner = owner;
        this.preferences = preferences;
        this.users = {}
        this.users[owner.getUUID()] = owner;
    }

    getUsers = () => {
        return this.users;
    }

    removeUser = (uuid) => {
        delete this.users[uuid];
    }

    addUser = (user) => {
        this.users[user.getUUID()] = user;
    }

    isFull = () => {
        return this.users.size >= this.MAX_CAPACITY;
    }

    getPreferences = () => {
        return this.preferences;
    }

    setPreferences = (preferences) => {
        this.preferences = preferences;
    }

    getGame = () => {
        return this.game;
    }

    setGame = (game) => {
        this.game = game;
    }

    getCode = () => {
        return this.code;
    }

    hasUser = (uuid) => {
        return this.users[uuid] !== undefined;
    }
}


if (module) {
    module.exports = Room;
}
},{}],3:[function(require,module,exports){
class User {
    uuid
    name
    color
    avatar

    constructor(uuid, name, color, avatar) {
        this.uuid = uuid;
        this.name = name;
        this.color = color;
        this.avatar = avatar;
    }

    getUUID = () => {
        return this.uuid;
    }

    getName = () => {
        return this.name;
    }

    getInfo = () => {
        return {color: this.color, avatar: this.avatar};
    }

    setInfo = (color, avatar) => {
        this.color = color;
        this.avatar = avatar;
    }
}
module.exports = User

},{}],4:[function(require,module,exports){
const {setCookie} = require('../functions')

const RoomFactory = require('../factories/RoomFactory');
const RF = new RoomFactory();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const code = location.search.slice(1);

    const joinRoomForm = document.getElementById('join_room');
    joinRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');


        socket.emit('check_room', {code, name, avatar});
    });

    socket.on('join_success', res => {
        setCookie("uuid", res.user.uuid, 1);
        setCookie("code", res.room.code, 1);

        const room = RF.getFromSocket(res.room);
        console.log(room)

        window.location.replace("/game");
    });
});
},{"../factories/RoomFactory":6,"../functions":8}],5:[function(require,module,exports){
const Game = require('../classe/Game');

class GameFactory {
    getFromSocket = game => {
        return new Game(
            game.roomCode,
            game.duration,
            game.wordAmount
        );
    }
}

module.exports = GameFactory;
},{"../classe/Game":1}],6:[function(require,module,exports){
const Room = require("../classe/Room");

const UserFactory = require('./UserFactory');
const UF = new UserFactory();

const GameFactory = require('./GameFactory');
const GF = new GameFactory();

class RoomFactory {
    getFromSocket = room => {
        const r = new Room(
            room.code,
            UF.getFromSocket(room.owner),
            room.preferences
        );

        r.setGame(GF.getFromSocket(room.game));

        for (const k in room.users) {
            r.addUser(UF.getFromSocket(
                room.users[k]
            ));
        }
        return r;
    }
}

module.exports = RoomFactory;
},{"../classe/Room":2,"./GameFactory":5,"./UserFactory":7}],7:[function(require,module,exports){
const User = require("../classe/User");

class UserFactory {
    getFromSocket = user => {
        return new User(
            user.uuid,
            user.name,
            user.color,
            user.avatar
        );
    }
}

module.exports = UserFactory
},{"../classe/User":3}],8:[function(require,module,exports){
(function (global){(function (){
const roomCode = () => {
    let code = "";
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

const codeExists = (code) => {
    for (const key in global.rooms) {
        if (key === code) return true;
    }
    return false;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

module.exports = { roomCode, codeExists, setCookie, getCookie };
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4]);
