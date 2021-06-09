const {getCookie} = require('../functions');
const RoomFactory = require('../factories/RoomFactory');

const RF = new RoomFactory();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const uuid = getCookie("uuid");
    const roomCode = getCookie("code")

    socket.emit('check_room', {uuid, roomCode});

    socket.on('check_room_success', serial_room => {
        const room = RF.getFromSocket(serial_room);
    });

    //TODO: Event listener start game button
    socket.emit('start_game', );
})