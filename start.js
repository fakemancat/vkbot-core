const { VK } = require('vk-io');
const vk = new VK();
const fs = require('fs');
const colors = require('colors');
const config = require("./config.js");
const cmds = fs
  .readdirSync(`${__dirname}/cmds/`)
  .filter((name) => /\.js$/i.test(name))
  .map((name) => require(`${__dirname}/cmds/${name}`));

if (config.group_id > 0 || config.group_id != 0) vk.setOptions({ 'token': config.token, 'pollingGroupId': config.group_id });
else vk.setToken(config.token);

let botN = '';
if (!config.bot_name_string || config.bot_name_string == '') return console.log('Укажите имя бота в файле config.js'.red.bold);
else botN = config.bot_name_string;

vk.updates.startPolling();
console.log(`Бот на ядре Fakeman Cat успешно запущен. Введите команду боту в ВК: ${botN}, тест`.green.bold);
vk.updates.on(['new_message', 'edit_message'], async(msg) => {
  if (msg.senderId < 1) return;

  if (!config.bot_name.test(msg.text) && msg.isChat) return;
  msg.setActivity();
  msg.text = msg.text.replace(config.bot_name, '');
  msg.nick = (await vk.api.users.get({ user_ids: msg.senderId }))[0].first_name;
  msg.owner = config.owner || 236908027;
  
  let cmd = cmds.find(cmd => cmd.regexp ? cmd.regexp.test(msg.text) : new RegExp(`\\s*(${cmd.tag.join('|')})`, "i"));
  if (!cmd) return;
  console.log(`${msg.senderId} => ${msg.text}`.green.bold);
  msg.ok = (text = "", params = {}) => {
    return msg.send('&#128215; | ' + text, params);
  };
  msg.error = (text = "", params = {}) => {
    return msg.send('&#128213; | ' + text, params);
  };
  if (cmd.admin && (!config.admins.includes(msg.senderId) && config.owner != msg.senderId)) {
    return msg.error('Команда только для админов и выше!');
  }
  if (cmd.vip && (!config.vips.includes(msg.senderId) && !config.admins.includes(msg.senderId) && config.owner != msg.senderId)) {
    return msg.error('Команда только для випов и выше!');
  }
  try {
    await cmd.func(msg, botN, { cmds, vk, VK, cmd });
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
