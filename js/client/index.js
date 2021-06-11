const {io} = require('socket.io-client')

const UserFactory = require("../factories/UserFactory");
const User = require('../classe/User')

const{ setCookie, genRandomAvatar } = require('../functions');

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const randomAvatar = document.getElementById('random_avatar');
    randomAvatar.addEventListener('click', () => {
        const new_avatar = genRandomAvatar();

        document.getElementById('avatar').setAttribute('src', '../src/img/'+new_avatar)
    });

    const createRoomForm = document.getElementById('create_room')
    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('test')

        const gameDuration = document.getElementById('game_duration').value;
        const wordAmount = document.getElementById('words-number').value;
        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');

        const color = 'yellow';
        const preferences = {gameDuration, wordAmount};

        /**
         * Envoie une demande au server pour créer une nouvelle room
         * Le server crée un nouveau utilisateur qu'il ajoute a la room automatiquement
         */
        socket.emit('host_room', preferences, name, color, avatar);
    });

    /**
     * Quand le serveur a bien créé la room il renvoit un event
     * Une fois l'event recu par le client il crée deux cookies
     *  - un pour l'UUID
     *  - un pour le code de la room
     * Ensuite le client est redirigé vers la pgae game
     */
    socket.on("success_host_room", (code, uuid) => {
        setCookie("uuid", uuid, 1);
        setCookie("code", code, 1);


        //socket.emit('new_user_join', code, serial_room);
        window.location.replace("/game");
    });

});