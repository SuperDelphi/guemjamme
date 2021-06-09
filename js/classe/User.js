class User {
    uuid
    name
    points
    multiplier
    color
    avatar

    constructor(uuid, name, color, avatar) {
        this.uuid = uuid;
        this.name = name;
        this.points = 0;
        this.resetMultiplier();
    }

    getUUID = () => {
        return this.uuid;
    }

    getName = () => {
        return this.name;
    }

    getPoints = () => {
        return this.points;
    }

    getMultiplier = () => {
        return this.multiplier;
    }

    setMultiplier = multiplier => {
        this.multiplier = multiplier;
    }

    resetMultiplier = () => {
        this.multiplier = 1;
    }

    getInfo = () => {
        return {color: this.color, avatar: this.avatar};
    }

    setInfo = (color, avatar) => {
        this.color = color;
        this.avatar = avatar;
    }

    addPoints = points => {
        this.points += points;
    }

    resetPoints = () => {
        this.points = 0;
    }
}
module.exports = User
