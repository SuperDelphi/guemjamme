class Word {
    word
    length
    letters = []
    position

    users = {}

    constructor(word, position) {
        this.word = word;
        this.length = word.length
        this.letters = word.split('');
        this.position = position;
    }

    addUser = (uuid, letter) => {
        if (this.users[uuid]) this.users[uuid] = []
        this.users[uuid].push(letter);
    }

    removeUser = (uuid) => {
        this.users.remove(uuid)
    }

    getUsers = () => {
        return this.users;
    }

    getLength = () => {
        return this.length;
    }

    getLetters = () => {
        return this.letters;
    }

    getWord = () => {
        return this.word;
    }

    getPosition = () => {
        return this.position;
    }

    includeLetter = (letter) => {
        return this.letters.includes(letter);
    }

    equalWord = (word) => {
        return this.word === word;
    }
}

module.exports = Word