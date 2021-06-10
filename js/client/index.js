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