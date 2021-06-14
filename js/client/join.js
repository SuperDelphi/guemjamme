const {setCookie, genRandomAvatar} = require('../functions')
const {setColor} = require('../client/views/join_views');
const {io} = require("socket.io-client");

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    /* Récupération du code de la room dans l'URL */
    const code = location.search.slice(1);

    /* Génère un nouvel avatar aléatoirement */
    const randomAvatar = document.getElementById('random_avatar');
    randomAvatar.addEventListener('click', () => {
        const new_avatar = genRandomAvatar();

        document.getElementById('avatar').setAttribute('src', '../src/img/'+new_avatar)
    });

    /**
     * Vérifie si la room passer en url existe
     */
    var color = 'pink';
    socket.emit('exist_room', code);
    socket.on('room_exist', res => {
        color = res;
        setColor(color);
    });


    /**
     * Lorsque le client envoie le formulaire pour rejoindre la room
     */
    const joinRoomForm = document.getElementById('join_room');
    joinRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');

        /**
         * Envoie la demande au serveur pour créer l'utilisateur et l'ajouter a la room
         */
        socket.emit('create_user', code, name, color, avatar);
    });

    /**
     * Event reçu du serveur après la création de l'utilisateur
     * Deux nouveau cookie sont enregisté :
     *  - code
     *  - uuid
     * Redirection du client vers la page /game de la room
     */
    socket.on('created_user', (code, uuid) => {
        setCookie("uuid", uuid, 1);
        setCookie("code", code, 1);

        window.location.replace("/game");
    });
});