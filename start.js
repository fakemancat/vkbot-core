// Модули
const { VK } = require('vk-io');
const vk = new VK();
const fs = require('fs');
const colors = require('colors');
const config = require("./config.js");
// database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database/db.json');
const db = low(adapter);

db.defaults({ users: [] }).write();
//

db.getUser = async(ID) => {
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

const cmds = fs
  .readdirSync(`${__dirname}/cmds/`)
  .filter((name) => /\.js$/i.test(name))
  .map((name) => require(`${__dirname}/cmds/${name}`));

// Определение профиля/группы, токена
if (config.group_id > 0 || config.group_id != 0) {
  vk.setOptions({
    'token': config.token,
    'pollingGroupId': config.group_id
  });
}
else {
  vk.setToken(config.token);
}

// Определение имени бота
let botN = '';
if (!config.bot_name_string || config.bot_name_string == '') {
  return console.log('Укажите имя бота в файле config.js'.red.bold);
}
else {
  botN = config.bot_name_string;
}

console.log(`Бот на ядре Fakeman Cat успешно запущен. Введите команду боту в ВК: ${botN}, тест`.green.bold);

// Начало обработчика
vk.updates.startPolling();
vk.updates.on(['new_message', 'edit_message'], async(msg) => {
  if (msg.senderId < 1 || msg.isOutbox) return;

  if (!config.bot_name.test(msg.text) && msg.isChat) return;
  msg.setActivity();
  await msg.loadMessagePayload();
  msg.text = msg.text.replace(config.bot_name, '');
  msg.user = await db.getUser(msg.senderId);
  msg.fwds = msg.forwards || null;

  if (msg.user.ban.isBanned) {
    return msg.send(`&#128213; | Вы забанены по причине: "${msg.user.ban.reason}"`);
  }

  let cmd = cmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : (new RegExp(`\\s*(${cmd.tag.join('|')})`, "i")).test(msg.text));
  if (!cmd) return msg.send('&#128213; | Команда не найдена');
  console.log(`${msg.senderId} => ${msg.text}`.green.bold);
  msg.ok = (text = "", params = {}) => {
    return msg.send('&#128215; | ' + text, params);
  };
  msg.error = (text = "", params = {}) => {
    return msg.send('&#128213; | ' + text, params);
  };
  if (msg.user.rights < cmd.rights) {
    return msg.error(`Команда доступна только ${[,'Випам', 'Админам', 'Создателю'][cmd.rights]} ${cmd.rights > 0 && cmd.rights !== 3 ? 'или выше' : ''}`);
  }
  try {
    await cmd.func(msg, { botN, cmds, vk, VK, cmd, db });
  }
  catch (e) {
    console.log(`Ошибка:\n${e}`.red.bold);
    msg.send(`Ошибка при выполнении команды '${msg.text}'`);
  }
});

process.on("uncaughtException", e => {
  console.log(e);
});

process.on("unhandledRejection", e => {
  console.log(e);
});
