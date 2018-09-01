const token = ""; //токен группы или профиля на котором будет стоять бот
const group_id = 0; //если бот будет стоять в группе, то 0 меняем на айди группы без -. Если бот будет стоять на профиле, то оставляем 0
const owner = 0; //Айди владельца бота. Нужно для команды ЖС. Параметр обязателен
const rightIcons = ['[&#10084;]', '[&#128155;]', '[&#128420;]', '[&#128736;]']; //Иконки прав в виде кода, указываются в отправлялке сообщений
// Можно сменить на свои: const rightIcons = ['Пользователь', 'Вип', 'Админ', 'Создатель'];

let bot_name_string = "";
// Тут имена бота. Сразу и для регекса.
// Если хотите что бы у бота было одно имя, то укажите после "let bot_name_string = " обычную строку с именем: 'Имя'
// Например: let bot_name_string = "Кот";
// Для тега нескольких имён писать так: let bot_name_string = [ "Имя1", "Имя2", "Имя3" ];
// Если вы решили использовать несколько имён, то в команде "Помощь" будет отображено только первое имя.

const bot_name = new RegExp(`^(${Array.isArray(bot_name_string) ? bot_name_string.join('|'): bot_name_string})[,\\s]*`, 'i');
bot_name_string = Array.isArray(bot_name_string) ? bot_name_string[0] : bot_name_string;

module.exports = {
  token,
  group_id,
  owner,
  bot_name,
  bot_name_string,
  rightIcons
};
