(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
const UserFactory = require("../factories/UserFactory");
const User = require('../classe/User')


const{ setCookie, getCookie } = require('../functions');

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const createRoomForm = document.getElementById('create_room')
    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('test')

        const gameDuration = document.getElementById('game_duration').value;
        const wordAmount = document.getElementById('words-number').value;
        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');

        socket.emit('host_room', {
            p: {gameDuration: gameDuration, wordAmound: wordAmount},
            name: name,
            color:"yellow",
            avatar: avatar
        });
    });

    socket.on("success_host_room", res => {
        setCookie("uuid", res.uuid, 1);
        setCookie("code", res.code, 1);

        socket.emit('new_user_join', {Sroom: res.code, room: res.room});
        window.location.replace("/game");
    });

});
},{"../classe/User":1,"../factories/UserFactory":3,"../functions":4}],3:[function(require,module,exports){
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
},{"../classe/User":1}],4:[function(require,module,exports){
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
},{}]},{},[2]);
