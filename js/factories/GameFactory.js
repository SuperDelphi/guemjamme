const Game = require('../classe/Game');

class GameFactory {
    getFromSocket = game => {
        return new Game(
            game.roomCode,
            game.duration,
            game.wordAmount
        );
    }
}

module.exports = GameFactory;