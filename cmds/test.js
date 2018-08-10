module.exports = {
  regexp: /^тест$/,
  func: async(msg, botN) => {
    msg.ok(`Бот успешно работает на ядре Fakeman Cat! Введите ${botN}, помощь для списка команд.`);
  },
  help: 'test',
  desc: 'проверка'
};
