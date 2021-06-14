const updatePlayerList = (game, users) => {
    const playerList = document.querySelector('.players-list');

    playerList.innerHTML = "";

    console.log(users)
    let sortable = [];
    for (const key in users) {
        const gameStat = game.getUserGameStats(key);
        sortable.push([users[key], gameStat.getScore()]);
    }

    /*console.log(sortable)

    sortable[1][1] = 54

    sortable.sort((a,b) => {
        return a[1] - b[1];
    });*/

    sortable.forEach(user => {

        const name = user[0].getName();
        const color = user[0].getInfo().color;
        const avatar = user[0].getInfo().avatar;
        const gameStat = game.getUserGameStats(user[0].getUUID());

        //console.log(gameStat.getScore(), gameStat.getMultiplier())

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
                        <p id="points-list" class="player-points-count">${gameStat.getScore()}</p>
                        <p class="player-points-title">pts</p>
                    </div>
                </div>
            </div>
        `
    });
}

function setPlayerColor(color) {

}

function setTimer(time) {
    const timer = document.getElementById('timer');
    timer.innerHTML = `<span class="bold">Temps restant : </span> ${time}`;
}

function setNumberPlayer(nb) {
    const nbPlayer = document.getElementById('nb-player');
    nbPlayer.innerHTML = `<span class="bold">Nombre de joueurs : </span>${nb}`;
}

function setPoints(points) {
    const inputPoints = document.getElementById('input-points');
    inputPoints.innerText = points;
}

module.exports = {
    updatePlayerList,
    setPlayerColor,
    setTimer,
    setNumberPlayer,
    setPoints
}