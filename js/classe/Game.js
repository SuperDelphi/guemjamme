const GameStats = require('./GameStats');

const Status = {
    WAITING: 1,
    PLAYING: 0,
    ENDED: -1
}

class Game {
    roomCode
    status
    words
    users
    duration
    endtime
    timeleft
    wordAmount

    constructor(roomCode, duration, wordAmount) {
        this.roomCode = roomCode;
        this.status = Status.WAITING;
        this.words = {};

        this.duration =  duration;
        this.endtime = Date.now() + 1000 * this.duration;
        this.timeleft = this.endtime - Date.now();

        this.wordAmount = wordAmount;

        this.users = {}
    }

    startGame = () => {
        this.status = Status.PLAYING;
    }

    setWords = (words) => {
        for (let i = 0; i < words.length; i++) {
            this.words[i] = words[i]
        }
    }

    getWords = () => {
        return this.words;
    }

    getUsers = () => {
        return this.users;
    }

    getNbPlayer = () => {
        return Object.keys(this.users).length;
    }

    getWordAmount = () => {
        return this.wordAmount;
    }

    getUserGameStats = (uuid) => {
        return this.users[uuid];
    }

    addUser = (uuid, gameStat = new GameStats()) => {
        this.users[uuid] = gameStat;
    }

    setUsers = (users) => {
        this.users = users;
    }

    getTimeLeft = () => {
        return this.timeleft;
    }

    getTimeLeftFormated = () => {
        let seconds = Math.floor((this.timeleft / 1000) % 60);
        let minutes = Math.floor((this.timeleft / (1000 * 60)) % 60);

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return `${minutes}:${seconds}`
    }

    getStatus = () => {
        switch (this.status) {
            case Status.WAITING:
                return 'WAITING';
            case Status.PLAYING:
                return 'PLAYING';
            case Status.ENDED:
                return 'ENDED';
        }
    }

    setStatus = (status) => {
        this.status = status;
    };
}

module.exports = Game;