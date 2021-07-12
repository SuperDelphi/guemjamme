const updatePlayerList = (game, users, win_info = {uuid: 0, word: 0, pts: 0, sign: 0}) => {
    const playerList = document.querySelector('.players-list');

    playerList.innerHTML = "";

    let sortable = [];
    for (const key in users) {
        const gameStat = game.getUserGameStats(key);
        sortable.push([users[key], gameStat.getScore()]);
    }

    sortable.sort((a,b) => {
        return b[1] - a[1];
    });

    sortable.forEach(user => {

        const name = user[0].getName();
        const color = user[0].getInfo().color;
        const avatar = user[0].getInfo().avatar;
        const gameStat = game.getUserGameStats(user[0].getUUID());

        /*if (user[0].getUUID() === win_info.uuid) {
            const pts = win_info.pts
            const word = win_info.word.word
            const signe = win_info.sign

            playerList.innerHTML += `
                <div id="${user[0].getUUID()}" class="player_box color-${color}">
                    <div class="player-picture">
                        <img src="${avatar}" alt="Image du joueur">
                        <div class="points-won ">
                            <p>${word}</p>
                            <div class="add-point">
                                <p>${signe}</p>
                                <p>${pts}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="player-infos hidden">
                        <p class="player-name">${name}</p>
            
                        <div class="player-score">
                            <p id="points-list" class="player-points-count">${gameStat.getScore()}</p>
                            <p class="player-points-title">pts</p>
                        </div>
                    </div>
                </div>
            `
        }*/
        playerList.innerHTML += `
            <div id="${user[0].getUUID()}" class="player_box color-${color}">
                <div class="player-picture">
                    <img src="${avatar}" alt="Image du joueur">
                    <div class="points-won hidden">
                        <p></p>
                        <div class="add-point">
                            <p></p>
                            <p></p>
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
    const playerName = document.querySelector('.input .player-name');
    playerName.classList.forEach(col => {
        if (col.includes('color')) playerName.classList.remove(col);
    })
    playerName.classList.add(`color-${color}`);
    const playerInput = document.getElementById('player-input');
    playerInput.classList.forEach(col => {
        if (col.includes('color')) playerInput.classList.remove(col);
    })
    playerInput.classList.add(`color-${color}`);
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

function setWords(words) {
    const wordsSection = document.querySelector('.game-section .words');
    wordsSection.innerHTML = ''
    for (const key in words) {
        wordsSection.innerHTML += `
            <div id="${words[key].getWord()}" class="word case-${words[key].getPosition()}">
                <div class="players-circles">
                </div>

                <div class="word-container default">
                    <p>${words[key].getWord()}</p>
                </div>
            </div>`
    }
}

function updateWordUsers(words) {
    for (const key in words) {
        let wordsUsers = document.querySelector(`#${words[key].getWord()} .players-circles`);

        let l = ``
        Object.keys(words[key].getUsers()).forEach(uuid => {
            if (words[key].getUsers()[uuid]) l += `<span class="circle color-${words[key].getUsers()[uuid]}"></span>`
        });
        wordsUsers.innerHTML = l
    }
}

function updateSliders() {
    const gameDurationSliderValue = document.querySelector('.game-duration.range .slider-value span')
    const wordsNumberSliderValue = document.querySelector('.words-number.range .slider-value span')

    const gameDurationInputSlider = document.querySelector('.game-duration.range input')
    const wordsNumberInputSlider = document.querySelector('.words-number.range input')


    gameDurationInputSlider.oninput = (() => {
        //updateSliders(time, words)
        let time = gameDurationInputSlider.value
        gameDurationSliderValue.textContent = `${time} sec.`
        gameDurationSliderValue.style.left = (time * 60 / 150) + 3 + '%'
    });

    wordsNumberInputSlider.oninput = (() => {
        //updateSliders(time, words)
        let words = wordsNumberInputSlider.value
        let add = 6.428571428571429
        wordsNumberSliderValue.textContent = `${words} mots`
        wordsNumberSliderValue.style.left = (words * 60 / 7) + add + '%'

    });
}

function updatePreferences(time, words) {
    const gameDuration = document.querySelector('.game-duration p span')
    const wordsNumber = document.querySelector('.words-number p span')

    gameDuration.textContent = `${time} sec.`
    wordsNumber.textContent = `${words} mots`
}

function updateScoreBoard(game, users) {
    const playerList = document.querySelector('.scoreboard');

    playerList.innerHTML = "";

    let sortable = [];
    for (const key in users) {
        const gameStat = game.getUserGameStats(key);
        sortable.push([users[key], gameStat.getScore()]);
    }

    sortable.sort((a,b) => {
        return b[1] - a[1];
    });

    const bestScore = sortable[0][1]

    let counter = 0;
    sortable.forEach(user => {
        const name = user[0].getName();
        const color = user[0].getInfo().color;
        const avatar = user[0].getInfo().avatar;
        const gameStat = game.getUserGameStats(user[0].getUUID());

        let classment = ''
        switch (counter) {
            case 0:
                classment = 'first'
                break
            case 1:
                classment = 'second'
                break
            case 2:
                classment = 'third'
                break
        }

        playerList.innerHTML += `
            <div class="player-container ${classment} color-${color}">
                <div class="charte" style="height: ${gameStat.getScore()/bestScore * 100}%">
                    <img src="${avatar}"  alt="Avatar du Joueur">
                    <div class="bar"></div>
                    <p class="points-final">${gameStat.getScore()} pts</p>
                </div>
                <span class="player_pseudo">${name}</span>
                <span class="podium">#${counter + 1}</span>
            </div>`

        counter += 1;
    });
}

module.exports = {
    updatePlayerList,
    setPlayerColor,
    setTimer,
    setNumberPlayer,
    setPoints,
    setWords,
    updateWordUsers,
    updateSliders,
    updatePreferences,
    updateScoreBoard
}