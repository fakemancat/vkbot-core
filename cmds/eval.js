module.exports = {
  regexp: /^жс|евал/i,
  func: async(msg, botN, { vk, cmds }) => {
    let code = msg.text.split(' ').slice(1).join(' ');

    try {
      let evaled = await eval(code);
      let type = typeof evaled;
      msg.ok(`Выполнено\nТип: ${type}\nРезультат: ${evaled}`);
    }
    catch (e) {
      return msg.error(e);
    }
  },
  help: 'жс',
  admin: true,
  desc: 'выполнить код'
};
