const {setCookie, genRandomAvatar} = require('../functions')
const {io} = require("socket.io-client");

const RoomFactory = require('../factories/RoomFactory');
const RF = new RoomFactory();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const code = location.search.slice(1);

    const randomAvatar = document.getElementById('random_avatar');
    randomAvatar.addEventListener('click', () => {
        const new_avatar = genRandomAvatar();

        document.getElementById('avatar').setAttribute('src', '../src/img/'+new_avatar)
    });


    const joinRoomForm = document.getElementById('join_room');
    joinRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');
        const color = 'pink';

        /**
         * Demande au server si cette room exist
         * Si elle n'existe pas rien ne se passe (pour le moment)
         * Si elle existe un nouvel utilisateur est créé et ajouté à la room
         */
        socket.emit('exist_room', code, name, color, avatar);
    });

    /**
     * Si le room spécifer dans l'URL exist
     * Deux nouveau cookie sont enregisté :
     *  - code
     *  - uuid
     * Puis le client est renvoyé vers la page game de la room
     */
    socket.on('room_exist', (code, uuid) => {
        setCookie("uuid", uuid, 1);
        setCookie("code", code, 1);

        window.location.replace("/game");
    });
});