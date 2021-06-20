const {} = require('../functions')
const {setDefaultPseudo} = require('../client/views/index_views');
const {io} = require('socket.io-client')

const { setCookie, genRandomAvatar, randomPseudo } = require('../functions');

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    setDefaultPseudo(randomPseudo())

    let new_avatar = genRandomAvatar();
    document.getElementById('avatar').setAttribute('src', '../src/img/'+new_avatar)
    /* Génère un nouvel avatar aléatoirement */
    const randomAvatar = document.getElementById('random_avatar');
    randomAvatar.addEventListener('click', () => {
        new_avatar = genRandomAvatar();
        document.getElementById('avatar').setAttribute('src', '../src/img/'+new_avatar)
    });

    /**
     * Lorsque le client envoie le formulaire pour créer la room
     */
    const createRoomForm = document.getElementById('create_room')
    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('test')

        const gameDuration = document.getElementById('game_duration').value;
        const wordAmount = document.getElementById('words-number').value;
        const name = document.getElementById('name').value;
        const avatar = document.getElementById('avatar').getAttribute('src');

        /**
         * Par défault le créateur de la room est en jaune (sans doute le passer coté serveur pour éviter les soucis)
         * Les préférences par défault sont :
         *      - 60s
         *      - 5w
         */
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

        window.location.replace("/game");
    });

});