const {getCookie} = require('../functions');
const {io} = require("socket.io-client");
const {
    updatePlayerList,
    setPlayerColor,
    setTimer,
    setNumberPlayer,
    setPoints,
    updateWords,
    updateSliders,
    updatePreferences,
    updateScoreBoard,
    updateWinInfos
} = require("./views/game_views");

const RoomFactory = require('../factories/RoomFactory');
const GameFactory = require('../factories/GameFactory')
const RF = new RoomFactory();
const GF = new GameFactory()

const Notification = require('../classe/Notification')
const notification = new Notification(document)

document.addEventListener('DOMContentLoaded', () => {

    const socket = io();

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
        updatePreferences(game.getDuration(), game.getWordAmount())

        setPlayerColor(user.getInfo().color);
        setTimer(game.getDurationFormated())
        setNumberPlayer(game.getNbPlayer())
        setPoints(userGS.getScore())

        notification.new('new join', `Un nouveau joueur a rejoint la partie <br>Nombres de joueurs : ${game.getNbPlayer()}`, notification.types.INFO)
    });

    /**
     * Show Link Button
     */
    const showLinkBtn = document.getElementById('show-link')
    const showLinkText = document.getElementById('link')
    showLinkBtn.addEventListener('click', () => {
        if (room.getOwner().getUUID() !== uuid) return;
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
        notification.new('link copied', `Le lien pour accéder à votre partie a été copié dans votre presse-papier`, notification.types.INFO)
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

        const resultSection = document.querySelector('.result-section');
        const gameSection = document.querySelector('.game-section')
        const playerList = document.querySelector('.players-list')
        const preferencesSection = document.querySelector('.settings-section')

        resultSection.classList.add('hidden');
        preferencesSection.classList.add('hidden')

        gameSection.classList.remove('hidden')
        playerList.classList.remove('hidden')

        updateWords(game.getWords())
        PLAYING = true

        notification.new('game started', `La partie viens de commencer ! Bonne chance !`, notification.types.SUCCESS, 2)
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
            if (input_user.length > 0) return socket.emit('input', code, input_user.join('').toLowerCase(), input_user, uuid)
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

    /**
     * Lorsqu'un client a appuyé sur une touche le serveur envoie la touche entrée aux autres clients
     */
    socket.on('update_letter', (serial_room) => {
        room = RF.getFromSocket(serial_room)
        game = room.getGame()
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        updateWords(game.getWords())
    })

    /**
     * Lorsqu'un mot à été écrit et validé par le serveur
     */
    socket.on('word_finish', (win_info, serial_room) => {
        room = RF.getFromSocket(serial_room)
        game = room.getGame()
        user = room.getUsers()[uuid];
        userGS = game.getUserGameStats(uuid);

        updatePlayerList(game, room.getUsers())
        updateWords(game.getWords())
        updateWinInfos(win_info)

        if (win_info.uuid === uuid) {
            document.getElementById('player-input').setAttribute('value', '');
            input_user = []
            setPoints(userGS.getScore())
        }
    });

    /**
     * Event pour mettre à jours le temops restant
     */
    socket.on('update_time', (time) => {
        setTimer(time)
    });

    /**
     * Lorsque le serveur anonce que le temps est écoulé
     */
    socket.on('game_finish', (serial_game) => {
        game = GF.getFromSocket(serial_game);
        room.setGame(game)

        PLAYING = false;

        const resultSection = document.querySelector('.result-section');
        const gameSection = document.querySelector('.game-section')
        const playerList = document.querySelector('.players-list')
        const preferencesSection = document.querySelector('.settings-section')

        resultSection.classList.remove('hidden')

        gameSection.classList.add('hidden')
        playerList.classList.add('hidden')
        preferencesSection.classList.add('hidden')

        updateSliders(game.getDuration(), game.getWordAmount());
        updateScoreBoard(game, room.getUsers())

        console.log(game.getScoreBoard(), game.getStatus())

        notification.new('game finish', `La partie se termine !`, notification.types.SUCCESS, 2)
    })

    /**
     * Restart Game Button Event
     */
    const restartGameBtn = document.getElementById('restart_game')
    restartGameBtn.addEventListener('click', () => {
        const gameDuration = document.getElementById('new_game_duration').value;
        const wordAmount = document.getElementById('new_words-number').value;

        if (room.getOwner().getUUID() !== uuid) return;

        game.setPreferences(gameDuration, wordAmount)

        socket.emit('restart_game', code, game);
    });

    /**
     * Lorsque le serveur a créé une nouvelle game dans la room
     */
    socket.on('game_restarted', (serial_room) => {
        room = RF.getFromSocket(serial_room);
        game = room.getGame();

        window.location.reload()
    });


    /**
     * If a user left the game
     */
    socket.on('user_left', (serial_room, userHasLeft) => {
        room = RF.getFromSocket(serial_room);
        game = room.getGame();

        updatePlayerList(game, room.getUsers())
        setNumberPlayer(game.getNbPlayer())

        notification.new('user deconnexion', `${userHasLeft.name} à été déconnecté`, notification.types.WARNING)
    });

    /**
     * If the game owner left the game
     */
    socket.on('owner_left', (userHasLeft) => {
        if (userHasLeft.uuid !== room.getOwner().getUUID()) return

        notification.new('owner deconnexion', `Le propriétaire de votre partie ${userHasLeft.name} à quitté, Cette partie va donc être fermée. <br>Vous pouvez toujours créer une nouvelle room <a href="/">ICI</a>`, notification.types.ERROR, 30)
        setTimeout(() => {
            window.location.replace('/')
        }, 30000)
    });

    /**
     * If the server is deconnecting
     */
    socket.on('disconnect', () => {
        notification.new('deconnexion', 'you have been disconnected. You will redirect to main page in 30sec.', notification.types.ERROR)
        setTimeout(() => {
            window.location.replace('/')
        }, 30000)
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