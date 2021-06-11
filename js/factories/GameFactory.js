const Game = require('../classe/Game');

class GameFactory {
    getFromSocket = game => {
        const g = new Game(
            game.roomCode,
            game.duration,
            game.wordAmount
        );

        g.setUsers(game.users);
        return g;
    }
}

module.exports = GameFactory;