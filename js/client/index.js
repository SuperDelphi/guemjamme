const UserFactory = require("../factories/UserFactory");
const User = require('../classe/User')

const{ setCookie, getCookie } = require('../functions');

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const createRoomForm = document.getElementById('create_room')
    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const gameDuration = document.getElementById('game_duration').value;
        const wordAmount = document.getElementById('words-number').value;
        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');

        socket.emit(
            'host_room',
            // TODO ({gameDuration, wordAmount}, name, color, avatar)
            {p: {gameDuration: gameDuration, wordAmound: wordAmount}, name: name, color:"jaune", avatar: avatar}
        );
    });

    socket.on("host_success", res => {
        setCookie("uuid", res.owner.uuid, 1);
        setCookie("code", res.roomCode, 1);

        window.location.replace("/game");
    });

});