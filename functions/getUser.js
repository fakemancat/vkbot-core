const { vk, db } = require('../start.js');

module.exports = async(ID) => {
    let user = db.get('users').find({ id: ID }).value();
    if (!user) {
        db.get('users').push({
            id: ID,
            userID: db.get('users').value().length + 1,
            nick: (await vk.api.users.get({ user_ids: ID }))[0].first_name,
            rights: 0,
            ban: {
                isBanned: false,
                reason: ''
            }
        }).write();
        user = db.get('users').find({ id: ID }).value();
    }
    return user;
};
