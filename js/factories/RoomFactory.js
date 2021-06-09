const Room = require("../classe/Room");
const UserFactory = require('./UserFactory');

class RoomFactory {
    getFromSocket = room => {
        const UF = new UserFactory()
        const r = new Room(
            room.roomCode,
            UF.getFromSocket(
                room.owner.uuid,
                room.owner.name,
                room.owner.color,
                room.owner.avatar,
            ),
            room.preferences
        );

        for (const k in room.users) {
            r.addUser(UF.getFromSocket(
                k,
                room.users[k].name,
                room.users[k].color,
                room.users[k].avatar,
            ));
        }
        return r;
    }
}

module.exports = RoomFactory