const {getCookie} = require('../functions');
const {io} = require("socket.io-client");
const {updatePlayerList, setPlayerColor} = require("./views/game_views");

const RoomFactory = require('../factories/RoomFactory');
const RF = new RoomFactory();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io("/",{ transports: ["websocket"] });

    const uuid = getCookie("uuid");
    const code = getCookie("code")

    /**
     * Quand un client arrive sur cette page (/game)
     * Et
     * Qu'il possede un cookie UUID et code (code de la room)
     * le client envoie un event join au server
     */
    socket.emit('join', code, uuid)

    /**
    * Si la room existe et que le client est dans la room
    * le serven envoie un event new_join avec les nouvelles infos sur la room
    * Ces infos permettent de mettre a jours la liste des joueurs
    */
    socket.on('new_join', (serial_room) => {
        let room = RF.getFromSocket(serial_room)

        let game = room.getGame();
        let user = room.getUsers()[uuid];
        console.log(room.getUsers())

        updatePlayerList(game, room.getUsers())
        setPlayerColor(user.getInfo().color)
    })


    //TODO: Event listener start game button
    //socket.emit('start_game', );
})