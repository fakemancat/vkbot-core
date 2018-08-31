module.exports = {
    tag: ['unban', 'разбан', 'разабанить', 'разабань'],
    func: async(msg, { vk, db }) => {
        let ID = msg.fwds[0] ? msg.fwds[0].from_id : msg.text.split(' ')[1];

        if (!ID || ID < 0 || isNaN(ID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        let user = await db.getUser(ID, { db, vk });
        if (!user.ban.isBanned) return msg.error('Этот пользователь уже разабанен');

        user.ban.isBanned = false;
        user.ban.reason = "";
        db.write();

        msg.ok(`Пользователь [id${user.id}|${user.nick}] успешно разбанен`);
    },
    rights: 2, // Команда для Админов и выше
    help: 'рабан [айди]',
    desc: 'разабанить пользователя'
};