const {getCookie} = require('../functions');
const {io} = require("socket.io-client");
const {
    updatePlayerList,
    setPlayerColor,
    setTimer,
    setNumberPlayer,
    setPoints,
    setWords,
    updateWordUsers,
    updateSliders
} = require("./views/game_views");

const RoomFactory = require('../factories/RoomFactory');
const GameFactory = require('../factories/GameFactory')
const RF = new RoomFactory();
const GF = new GameFactory()

document.addEventListener('DOMContentLoaded', () => {

    const socket = io("/",{ transports: ["websocket"] });

    /* Récupération des cookies */
    const uuid = getCookie("uuid");
    const code = getCookie("code")

    var link = `localhost:3000/join?${code}`;

    var room
    var game
    var user
    var userGS

    var PLAYING = false;

    /**
     * Quand un client arrive sur cette page (/game)
     * Et
     * Qu'il possede un cookie UUID et code (code de la room)
     * le client envoie un event join au server
     */
    socket.emit('join', code, uuid)

    /**
    * Si la room existe et que le client est dans la room
    * le serveur envoie un event new_join avec les nouvelles infos sur la room
    * Ces infos permettent de mettre a jours la liste des joueurs
    */
    socket.on('new_join', (serial_room) => {
        room = RF.getFromSocket(serial_room)

        game = room.getGame();
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        updatePlayerList(game, room.getUsers())
        updateSliders(game.getDuration(), game.getWordAmount())

        setPlayerColor(user.getInfo().color);
        setTimer(game.getDurationFormated())
        setNumberPlayer(game.getNbPlayer())
        setPoints(userGS.getScore())
    });



    /**
     * Show Link Button
     */
    const showLinkBtn = document.getElementById('show-link')
    const showLinkText = document.getElementById('link')
    showLinkBtn.addEventListener('click', () => {
        if (room.getOwner().getUUID() !== uuid) return;
        console.log('link shown')
        showLinkBtn.classList.toggle('hidden')
        showLinkText.classList.toggle('hidden')

        showLinkText.setAttribute('value', link);
    });

    /**
     * Copy Link Button
     */
    const copyLinkBtn = document.getElementById('copy-link')
    copyLinkBtn.addEventListener('click', () => {
        if (room.getOwner().getUUID() !== uuid) return;
        var temp = document.createElement("INPUT");
        temp.value = link;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        alert('Link Copied !')
    });


    /**
     * Start Game Button Event
     */
    const startGameBtn = document.getElementById('start_game');
    startGameBtn.addEventListener('click', () => {
        if (room.getOwner().getUUID() !== uuid) return;
        socket.emit('start_game', code);
    });


    /**
     * Lorsque la game a été déclarée comme commencée
     */
    socket.on('game_started', (serial_room) => {
        room = RF.getFromSocket(serial_room);
        game = room.getGame();
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        const preferencesSection = document.querySelector('.settings-section');
        const gameSection = document.querySelector('.game-section');

        preferencesSection.classList.toggle('hidden');
        gameSection.classList.toggle('hidden');

        setWords(game.getWords())
        PLAYING = true
    });


    /**
     * KeyDown Event listener
     */
    const char = "abcdefghijklmnopqrstuvwxyz";
    var input_user = []
    document.addEventListener('keydown', (e) => {
        e.preventDefault();

        // Si le status de la game n'est pas 'PLAYING'
        if (game.getStatus() !== 'PLAYING' && !PLAYING) return

        // Si la touche pressé est BackSpace (suppr)
        if (e.keyCode === 8 && input_user.length > 0) {
            input_user.pop();
            document.getElementById('player-input').setAttribute('value', input_user.join('').toLowerCase());
        }

        // Si la touche pressé est Enter
        if (e.keyCode === 13 && input_user.length > 0) {
            const word_final = document.getElementById('player-input').getAttribute('value');
            socket.emit('press_enter', code, word_final.toLowerCase(), input_user, uuid);
        }

        // Si la touche pressé est un caratères inclus dans char
        if (char.includes(e.key)) {
            input_user.push(e.key)
            document.getElementById('player-input').setAttribute('value', input_user.join('').toLowerCase());
            socket.emit('input', code, input_user.join('').toLowerCase(), input_user, uuid)
        }
    });

    socket.on('update_letter', (serial_room) => {
        room = RF.getFromSocket(serial_room)
        game = room.getGame()
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        setWords(game.getWords())
        updateWordUsers(game.getWords())
        //setTimer(game.getTimeLeftFormated())
    })

    socket.on('word_finish', (win_info, serial_room) => {
        room = RF.getFromSocket(serial_room)
        game = room.getGame()
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        updatePlayerList(game, room.getUsers(), win_info)
        setWords(game.getWords())

        if (win_info.uuid === uuid) {
            document.getElementById('player-input').setAttribute('value', '');
            input_user = []
            setPoints(userGS.getScore())
        }
    });

    socket.on('update_time', (time) => {
        setTimer(time)
    });

    socket.on('game_finish', (serial_game) => {
        game = GF.getFromSocket(serial_game);
        room.setGame(game)

        console.log(game.getScoreBoard(), game.getStatus())

        PLAYING = false;
    })
})

/**
 * Demande du client pour update la room
 *
 * @param socket
 * @param code
 * @param room
 * @returns {Promise<unknown>}
 */
const updateRoom = (socket, code, room) => {
    return new Promise((resolve, reject) => {
        socket.emit('update_room', code, room);
        socket.on('updated_room', (serial_room) => {
           resolve(RF.getFromSocket(serial_room));
        });
    });
}