module.exports = {
    tag: ['ban', 'бан', 'забанить', 'забань'],
    func: async(msg, { db }) => {
        let ID = msg.fwds[0] ? msg.fwds[0].senderId : msg.text.split(' ')[1];
        let reason = (msg.fwds[0] ? msg.text.split(' ').slice(1).join(' ') : msg.text.split(' ').slice(2).join(' ')).replace(/\n/g, " ");
        if (!ID || ID < 0 || isNaN(ID)) return msg.error('Укажите правильный айди'); // Если айди не указан или айди меньше нуля (группа) или айди не равен числу, то пишем, что нужно указать айди.
        if (!reason || reason.length > 20) return msg.error('Укажите причину бана длиной не больше 20 символов');

        let user = await db.getUser(ID);
        if (user.ban.isBanned) return msg.error('Этот пользователь уже забанен');

        user.ban.isBanned = true;
        user.ban.reason = reason;
        db.write();

        msg.ok(`Пользователь [id${user.id}|${user.nick}] успешно забанен по причине: "${reason}"`);
    },
    rights: 2, // Команда для Админов и выше
    help: 'бан [айди]',
    desc: 'забанить пользователя'
};
