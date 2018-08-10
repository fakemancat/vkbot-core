vkbot-core
============
#### Готовое ядро для модульного бота вк основанный на Node.js под управлением модуля VK-IO

#### Windows:
1. Скачать и установить на ПК программу Node.js
2. После установки скачать папку FMCcore
3. Открыть файл config.js
4. Настроить конфигурации для бота. Всё нужное закомментированно в самом файле config.js
3. Открыть командную строку Windows
4. Ввести: cd полный\путь\до\папки. Например: C:\Users\Fakeman Cat\Desktop\FMCcore
5. Ввести: npm i vk-io
6. Ввести: npm i colors
7. Ввести: npm i fs
8. Для запуска бота ввести: node start

#### Ubuntu (VDS/VPS):
1. Установить Node.js по этому гайду: https://www.8host.com/blog/ustanovka-node-js-pri-pomoshhi-nvm/
2. Ввести:</br>
  sudo apt-get update</br>
  sudo apt-get install git</br>
  cd /root</br>
  git clone https://github.com/fakemancat/vkbot-core.git
4. Подключиться по sftp у своему VDS/VPS
3. Открыть папку /root/vkbot-core
4. Открыть файл config.js
5. Настроить конфигурации для бота. Всё нужное закомментированно в самом файле config.js
6. Выйти, сохранить config.js
7. В консоли вводим:</br>
  cd /root/vkbot-core</br>
  npm i vk-io</br>
  npm i colors</br>
  npm i fs</br>
  Для запуска бота ввести: node start</br>

Если всё верно, то в командную строку выдаст: "Бот на ядре Fakeman Cat успешно запущен. Введите команду боту в ВК: (Имя бота), тест"
Если выдало ошибку или бот не запустился. То пишите мне об этом в [ЛС](https://vk.com/im?sel=236908027)

Для выключения бота нужно зажать сочитание клавиш CTRL + C или CTRL + Z

Добавление команд я покажу в видео, которое скоро запишу :)
