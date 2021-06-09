class User {
    uuid
    name
    color
    avatar

    constructor(uuid, name, color, avatar) {
        this.uuid = uuid;
        this.name = name;
        this.color = color;
        this.avatar = avatar;
    }

    getUUID = () => {
        return this.uuid;
    }

    getName = () => {
        return this.name;
    }

    getInfo = () => {
        return {color: this.color, avatar: this.avatar};
    }

    setInfo = (color, avatar) => {
        this.color = color;
        this.avatar = avatar;
    }
}
module.exports = User
