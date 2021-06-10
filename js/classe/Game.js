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

    constructor(roomCode, duration, wordAmount) {
        this.roomCode = roomCode;
        this.status = Status.WAITING;
        this.words = [];

        this.duration =  duration;
        this.endtime = Date.now() + 1000 * this.duration;
        this.timeleft = this.endtime - Date.now();

        this.wordAmount = wordAmount;

        this.users = {}
    }

    startGame = () => {
        this.status = Status.PLAYING;
    }

    setWords = (words, amount) => {
        // TODO: maybe API request
        this.words = words;
    }

    getWords = () => {
        return this.words;
    }
}

module.exports = Game;