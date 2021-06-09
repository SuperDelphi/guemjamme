const UserFactory = require("../factories/UserFactory");
const User = require('../classe/User')

const{ setCookie, getCookie } = require('../functions');

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.emit(
        'host_room',
        // TODO ({gameDuration, wordAmount}, name, color, avatar)
        {p: {gameDuration: 60, wordAmound: 5}, name:"Connard", color:"jaune", avatar:1}
    );

    socket.on("host_success", owner => {
        setCookie("uuid", owner.uuid, 1);
    });

});