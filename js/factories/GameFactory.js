const Game = require('../classe/Game');
const Word = require('../classe/Word')

const GameStatsFactory = require('./GameStatsFactory');
const GSF = new GameStatsFactory();

class GameFactory {
    getFromSocket = game => {
        const g = new Game(
            game.roomCode,
            game.duration,
            game.wordAmount
        );

        g.setStatus(game.status)

        let words = []
        game.words.forEach(word => {
            const w = new Word(word.word, word.position)

            Object.keys(word.users).forEach(uuid => {
                w.addUser(uuid, word.users[uuid])
            });

            words.push(w)
        });
        g.setWords(words)

        for (const k in game.users) {
            g.addUser(k, GSF.getFromSocket(game.users[k]));
        }
        return g;
    }
}

module.exports = GameFactory;