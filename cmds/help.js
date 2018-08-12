module.exports = {
  regexp: /^(помощь|команды|х[еэ]лп)$/i,
  func: async(msg, botN, { cmds }) => {
    let result = [
      `&#128215; | Команды бота ${botN}.`,
      ``,
      cmds.map((cmd) => `&#128313; | ${botN}, ${cmd.help} -- ${cmd.desc}`).join('\n'),
      ``,
      `&#128203; | Бот основан на ядре от [id236908027|Fakeman Cat]`
    ].join('\n');
    msg.send(result);
  },
  help: 'помощь',
  desc: 'список команд'
};
