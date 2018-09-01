module.exports = {
  regexp: /^(а?жс+)/i,
  func: async(msg, { botN, vk, cmds, db }) => {
    let code = msg.text.split(' ').slice(1).join(' ');
    let name = msg.text.split(' ')[0];

    try {
      let evaled, type;
      if (/^(жс)$/i.test(name)) {
        evaled = await eval(code);
        type = typeof evaled;
      }
      if (/^(жсс)$/i.test(name)) {
        evaled = eval(code);
        type = typeof evaled;
        evaled = JSON.stringify(evaled, null, '&#12288;');
      }
      else if (/^(ажс)$/i.test(name)) {
        evaled = eval(`(async() => {${code}})()`);
        type = typeof evaled;
      }
      msg.answer(`Выполнено\nТип: ${type}\nРезультат: ${evaled}`);
    }
    catch (e) {
      return msg.error(e);
    }
  },
  rights: 3,
  help: 'жс [код]',
  desc: 'выполнить код'
};
