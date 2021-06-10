const {getCookie} = require('../functions');
const {io} = require("socket.io-client");

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
        const room = RF.getFromSocket(serial_room)
        console.table(room)

        const game = room.getGame();
        game.setUsers(room.getUsers())

        updateUserList(game.getUsers())
    })

    //TODO: Event listener start game button
    //socket.emit('start_game', );
})






function updateUserList(users) {
    document.querySelector('.players-list').innerHTML = "";
    for (const key in users) {
        document.querySelector('.players-list').innerHTML += `
            <div class="player_box color-yellow">
                <div class="player-picture">
                    <img src="${users[key].avatar}" alt="Image du joueur">
                    <div class="points-won hidden">
                        <p>Icarudazdazdazda</p>
                        <div class="add-point">
                            <p>+</p>
                            <p>56</p>
                        </div>
                    </div>
                </div>
    
                <div class="player-infos">
                    <p class="player-name">${users[key].name}</p>
    
                    <div class="player-score">
                        <p class="player-points-count">0</p>
                        <p class="player-points-title">pts</p>
                    </div>
                </div>
            </div>
            `
    }
}