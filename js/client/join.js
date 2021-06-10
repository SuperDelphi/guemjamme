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