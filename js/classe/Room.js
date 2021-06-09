class Room {
    code
    owner
    nb_words
    time
    users

    constructor(code, owner) {
        this.code = code;
        this.owner = owner;
        this.users = {}
        this.users[owner.getUUID()] = owner;
    }

    setInfo = (time, nb_words) => {
        this.time = time;
        this.nb_words = nb_words;
    }

    getInfo = () => {
        return {time: this.time, nb_words: this.nb_words};
    }

    getCode = () => {
        return this.code;
    }
}


if (module) {
    module.exports = Room;
}