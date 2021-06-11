const updatePlayerList = (game, users) => {
    const playerList = document.querySelector('.players-list');

    playerList.innerHTML = "";

    for (const key in users) {

        const name = users[key].getName();
        const color = users[key].getInfo().color;
        const avatar = users[key].getInfo().avatar;
        const gameStat = game.getUserGameStats(key);
        console.log(key, gameStat, game)

        playerList.innerHTML += `
            <div class="player_box color-${color}">
                <div class="player-picture">
                    <img src="${avatar}" alt="Image du joueur">
                    <div class="points-won hidden">
                        <p>Icarudazdazdazda</p>
                        <div class="add-point">
                            <p>+</p>
                            <p>56</p>
                        </div>
                    </div>
                </div>
        
                <div class="player-infos">
                    <p class="player-name">${name}</p>
        
                    <div class="player-score">
                        <p class="player-points-count">${0}</p>
                        <p class="player-points-title">pts</p>
                    </div>
                </div>
            </div>
        `
    }
}

function setPlayerColor(color) {

}


module.exports = { updatePlayerList, setPlayerColor }