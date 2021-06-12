const User = require("../classe/User");

class UserFactory {
    getFromSocket = user => {
        console.log(user)
        return new User(
            user.uuid,
            user.name,
            user.color,
            user.avatar
        );
    }
}

module.exports = UserFactory