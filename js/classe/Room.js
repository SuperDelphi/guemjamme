class Room {
    code
    owner
    // Object with {wordAmount, gameDuration}
    preferences
    users
    game
    MAX_CAPACITY = 6

    constructor(code, owner, preferences) {
        this.code = code;
        this.owner = owner;
        this.preferences = preferences;
        this.users = {}
        this.users[owner.getUUID()] = owner;
    }

    getUsers = () => {
        return this.users;
    }

    removeUser = (uuid) => {
        delete this.users[uuid];
    }

    addUser = (user) => {
        this.users[user.getUUID()] = user;
    }

    isFull = () => {
        return this.users.size >= this.MAX_CAPACITY;
    }

    getPreferences = () => {
        return this.preferences;
    }

    setPreferences = (preferences) => {
        this.preferences = preferences;
    }

    getGame = () => {
        return this.game;
    }

    setGame = (game) => {
        this.game = game;
    }

    getCode = () => {
        return this.code;
    }

    hasUser = (uuid) => {
        return this.users[uuid] !== undefined;
    }
}


if (module) {
    module.exports = Room;
}