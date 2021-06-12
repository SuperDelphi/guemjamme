const Game = require('../classe/Game');

const GameStatsFactory = require('./GameStatsFactory');
const GSF = new GameStatsFactory();

class GameFactory {
    getFromSocket = game => {
        const g = new Game(
            game.roomCode,
            game.duration,
            game.wordAmount
        );

        for (const k in game.users) {
            g.addUser(k, GSF.getFromSocket(game.users[k]));
        }
        return g;
    }
}

module.exports = GameFactory;