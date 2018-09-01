module.exports = {
  regexp: /^(помощь|команды|х[еэ]лп)$/i,
  func: async(msg, { botN, cmds }) => {
    let result = [
      `Команды бота ${botN}.`,
      ``,
      `&#128313; Команды для Пользователей &#128313;`,
      cmds
      .filter(cmd => cmd.rights == 0)
      .map(cmd => `[&#128312;] ${botN}, ${cmd.help} -- ${cmd.desc}`).join('\n') || '[&#128312;] Нет команд для Пользователей',
      ``,
      `&#128313; Команды для Випов &#128313;`,
      cmds
      .filter(cmd => cmd.rights == 1)
      .map(cmd => `[&#128312;] ${botN}, ${cmd.help} -- ${cmd.desc}`).join('\n') || '[&#128312;] Нет команд для Випов',
      ``,
      `&#128313; Команды для Админов &#128313;`,
      cmds
      .filter(cmd => cmd.rights == 2)
      .map(cmd => `[&#128312;] ${botN}, ${cmd.help} -- ${cmd.desc}`).join('\n') || '[&#128312;] Нет команд для Админов',
      ``,
      `&#128313; Команды для создателя &#128313;`,
      cmds
      .filter(cmd => cmd.rights == 3)
      .map(cmd => `[&#128312;] ${botN}, ${cmd.help} -- ${cmd.desc}`).join('\n') || '[&#128312;] Нет команд для Создателя',
      ``,
      `&#128203; | Бот основан на ядре от [id236908027|Fakeman Cat]`
    ].join('\n');
    msg.ok(result);
  },
  rights: 0,
  help: 'помощь',
  desc: 'список команд'
};
