const {getCookie} = require('../functions');
const RoomFactory = require('../factories/RoomFactory');
const {io} = require("socket.io-client");



const RF = new RoomFactory();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const uuid = getCookie("uuid");
    const code = getCookie("code")

    //const room = global.rooms[code]

    //updateUserList(room.getUsers())


    socket.on('new_user_join', res => {
        const room = RF.getFromSocket(res.room)
        console.table(room)
    })

    //TODO: Event listener start game button
    //socket.emit('start_game', );
})






function updateUserList(users) {
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