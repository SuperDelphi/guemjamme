const User = require("../classe/User");

class UserFactory {
    getFromSocket = user => {
        return new User(
            user.uuid,
            user.name
        );
    }
}

module.exports = UserFactory