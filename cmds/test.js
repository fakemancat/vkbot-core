module.exports = {
  regexp: /^тест$/,
  func: function(msg, { botN }) {
    msg.ok(`Бот успешно работает на ядре Fakeman Cat! Введите ${botN}, помощь для списка команд.`);
  },
  help: 'test',
  desc: 'проверка'
};
