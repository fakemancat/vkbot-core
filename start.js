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

// Объявляем объект с командами
const cmds = fs
  .readdirSync(`${__dirname}/cmds/`)
  .filter((name) => /\.js$/i.test(name))
  .map((name) => require(`${__dirname}/cmds/${name}`));

// Определяем профиль/группу, токен
if (config.group_id > 0 || config.group_id != 0) {
  vk.setOptions({
    'token': config.token,
    'pollingGroupId': config.group_id
  });
}
else {
  vk.setToken(config.token);
}

// Определяем имя бота
let botN = '';
if (!config.bot_name_string || config.bot_name_string == '') {
  return console.log('Укажите имя бота в файле config.js'.red.bold);
}
else {
  botN = config.bot_name_string;
}

// Консолим успешный запуск
console.log(`Бот на ядре Fakeman Cat успешно запущен. Введите команду боту в ВК: ${botN}, тест`.green.bold);

// Запускаем Полинг (Polling)
vk.updates.startPolling();

// Запускаем обработчик новых и изменённых сообщений
vk.updates.on(['new_message', 'edit_message'], async(msg) => {
  // Если сообщение от группы или исходящее, то возвращаем
  if (msg.senderId < 1 || msg.isOutbox) {
    return;
  }
  // Если в сообщении нет обращения к боту и если это чат, то возвращаем
  if (!config.bot_name.test(msg.text) && msg.isChat) {
    return;
  }

  // Консолим сообщения
  console.log(msg.subTypes[0] + ` ${msg.senderId} => ${msg.text}`.green.bold);

  // Делаем так, чтобы бот писал...
  msg.setActivity();

  // Загружаем весь paylaod. Нужно от возникновения ошибок
  if (config.group_id == 0) {
    await msg.loadMessagePayload();
  }
  
  // Объявление важных переменных:
  msg.text = msg.text.replace(config.bot_name, ''); // Текст сообщения равен тексту без имени бота: Кот, привет => привет
  msg.user = await db.getUser(msg.senderId); // Переменная содержащая в себе информацию о пользователе из базы
  msg.fwds = msg.forwards || []; // Просто упрощение..
  
  // Определяем команду по regexp или tag. Если команды нет, то пишем об этом  
  let cmd = cmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(msg.text));
  if (!cmd) return msg.send('&#128213; | Команда не найдена');

  // Функции "отправлялки" сообщений
  msg.answer = (text = "", params = {}) => {
    const result = msg.isChat ? `${config.rightIcons[msg.user.rights]} ${msg.user.nick},\n${text}` : `${text}`;
    return msg.send(result, params);
  };
  msg.ok = (text = "", params = {}) => {
    return msg.answer('&#128215; | ' + text, params);
  };
  msg.error = (text = "", params = {}) => {
    return msg.answer('&#128213; | ' + text, params);
  };

  // Проверки пользователя
  if (msg.user.rights < cmd.rights) {
    return msg.error(`Команда доступна только ${[,'Випам', 'Админам', 'Создателю'][cmd.rights]} ${cmd.rights > 0 && cmd.rights !== 3 ? 'или выше' : ''}`);
  }
  if (msg.user.ban.isBanned) {
    return msg.send(`&#128213; | Вы забанены по причине: "${msg.user.ban.reason}"`);
  }

  // Выполнение функции через try { ... } catch() { ... }
  try {
    await cmd.func(msg, { botN, cmds, vk, VK, cmd, db });
  }
  catch (e) {
    console.log(`Ошибка:\n${e}`.red.bold);
    msg.error(`Ошибка при выполнении команды '${msg.text}'`);
  }
});

// Консолим ошибки
process.on("uncaughtException", e => {
  console.log(e);
});

process.on("unhandledRejection", e => {
  console.log(e);
});
