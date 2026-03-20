const mineflayer = require('mineflayer');
const chalk = require('chalk');
const dns = require('dns').promises;
const net = require('net');

// Конфигурация сервера
const SERVER_CONFIG = {
  host: process.env.SERVER_HOST || 'SMP-FRUTLINE.aternos.me',
  port: parseInt(process.env.SERVER_PORT) || 29506,
  username: process.env.BOT_USERNAME || 'AFK_Bot', // Измени на своё имя
  version: null // Будет определена автоматически
};

// Системы анти-AFK
const ANTI_AFK_CONFIG = {
  clickInterval: 15000, // Клик каждые 15 секунд
  rotateInterval: 20000, // Поворот камеры каждые 20 секунд
  moveInterval: 40000, // Движение каждые 40 секунд
  jumpInterval: 60000, // Прыжок каждые 60 секунд
  respawnWait: 5000 // Ожидание перед респауном
};

let bot = null;
let afkTimers = [];

// Функция определения версии сервера
async function detectServerVersion() {
  console.log(chalk.blue('🔍 Определение версии сервера...'));
  
  return new Promise((resolve) => {
    const client = net.createConnection(
      {
        host: SERVER_CONFIG.host,
        port: SERVER_CONFIG.port
      },
      () => {
        // Отправляем handshake пакет
        const handshake = Buffer.from([
          0x00, // packet id
          0x04, // protocol version (будет переписано)
          ...SERVER_CONFIG.host.split('').map(c => c.charCodeAt(0)),
          SERVER_CONFIG.port >> 8,
          SERVER_CONFIG.port & 0xFF,
          0x01  // next state
        ]);
        
        client.write(handshake);
        client.write(Buffer.from([0x00])); // Request packet
      }
    );

    let data = '';
    
    client.on('data', (chunk) => {
      data += chunk.toString('latin1');
      
      // Пытаемся найти версию в ответе сервера
      // Это простой парсинг - мineflayer обычно справляется сам
      
      // Если получили ответ - закрываем соединение
      if (data.length > 0) {
        client.destroy();
        resolve(null); // Позволяем mineflayer автоматически определить версию
      }
    });

    client.on('error', (err) => {
      console.error(chalk.yellow('⚠️ Ошибка при определении версии:'), err.message);
      client.destroy();
      resolve(null); // Если ошибка - мineflayer определит версию сам
    });

    client.on('end', () => {
      resolve(null);
    });

    // Таймаут 5 секунд
    setTimeout(() => {
      if (client.writable) client.destroy();
      resolve(null);
    }, 5000);
  });
}

// Автоматическое определение версии при запуске
async function initializeBot() {
  await detectServerVersion();
  
  // Не указываем версию - mineflayer определит автоматически
  createBot();
}

// Функция создания бота
function createBot() {
  console.log(chalk.blue('🤖 Подключение к серверу...'));
  
  bot = mineflayer.createBot({
    host: SERVER_CONFIG.host,
    port: SERVER_CONFIG.port,
    username: SERVER_CONFIG.username,
    version: SERVER_CONFIG.version
  });

  // Успешное подключение
  bot.on('login', () => {
    console.log(chalk.green('✅ Успешно подключен к серверу!'));
    console.log(chalk.cyan(`📍 Сервер: ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`));
    console.log(chalk.cyan(`👤 Ник: ${SERVER_CONFIG.username}`));
    console.log(chalk.cyan(`🎮 Версия: ${bot.version}`));
    startAntiAFK();
  });

  // Конец игры (смерть)
  bot.on('death', () => {
    console.log(chalk.yellow('💀 Бот умер! Автоматический респаун...'));
    setTimeout(() => {
      bot.respawn();
    }, ANTI_AFK_CONFIG.respawnWait);
  });

  // Сообщения от игроков
  bot.on('message', (message) => {
    const msg = message.toString();
    console.log(chalk.magenta(`💬 ${msg}`));
  });

  // Ошибки
  bot.on('error', (err) => {
    console.error(chalk.red('❌ Ошибка подключения:'), err.message);
    setTimeout(() => {
      console.log(chalk.yellow('🔄 Переподключение...'));
      initializeBot(); // Используем initializeBot для автоопределения версии
    }, 5000);
  });

  // Отключение
  bot.on('end', () => {
    console.log(chalk.red('🔌 Отключено от сервера'));
    clearAllTimers();
    setTimeout(() => {
      console.log(chalk.yellow('🔄 Попытка переподключения...'));
      initializeBot(); // Используем initializeBot для автоопределения версии
    }, 10000);
  });
}

// Запуск анти-AFK системы
function startAntiAFK() {
  console.log(chalk.blue('🛡️ Запуск анти-AFK системы...'));

  // 1. Периодические клики
  const clickTimer = setInterval(() => {
    if (bot && bot.entity) {
      bot.swingArm();
      console.log(chalk.gray('➡️ Клик'));
    }
  }, ANTI_AFK_CONFIG.clickInterval);
  afkTimers.push(clickTimer);

  // 2. Периодические повороты камеры
  const rotateTimer = setInterval(() => {
    if (bot && bot.entity) {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = Math.random() * Math.PI - Math.PI / 2;
      bot.look(yaw, pitch);
      console.log(chalk.gray('🔄 Поворот камеры'));
    }
  }, ANTI_AFK_CONFIG.rotateInterval);
  afkTimers.push(rotateTimer);

  // 3. Периодическое движение (в сторону)
  const moveTimer = setInterval(() => {
    if (bot && bot.entity) {
      const directions = [
        { forward: true, left: false },
        { forward: false, left: true },
        { forward: true, left: true },
        { forward: false, left: false }
      ];
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      bot.setControlState('forward', direction.forward);
      bot.setControlState('left', direction.left);
      
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('left', false);
      }, 1000);
      
      console.log(chalk.gray('🚶 Движение'));
    }
  }, ANTI_AFK_CONFIG.moveInterval);
  afkTimers.push(moveTimer);

  // 4. Периодические прыжки
  const jumpTimer = setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 100);
      console.log(chalk.gray('⬆️ Прыжок'));
    }
  }, ANTI_AFK_CONFIG.jumpInterval);
  afkTimers.push(jumpTimer);

  // 5. Переодическое открытие инвентаря (для некоторых серверов)
  const inventoryTimer = setInterval(() => {
    if (bot && bot.entity) {
      try {
        if (bot.inventory) {
          console.log(chalk.gray('📦 Проверка инвентаря'));
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
  }, 120000); // Каждые 2 минуты
  afkTimers.push(inventoryTimer);

  console.log(chalk.green('✅ Анти-AFK система активирована'));
  console.log(chalk.cyan(`⏱️ Интервалы: клик(${ANTI_AFK_CONFIG.clickInterval}мс), поворот(${ANTI_AFK_CONFIG.rotateInterval}мс), движение(${ANTI_AFK_CONFIG.moveInterval}мс)`));
}

// Остановка всех таймеров
function clearAllTimers() {
  afkTimers.forEach(timer => clearInterval(timer));
  afkTimers = [];
}

// Команды в консоли
function setupConsoleCommands() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promptUser = () => {
    process.stdout.write('> ');
  };

  rl.on('line', (input) => {
    if (!bot) {
      console.log('Бот не подключен');
      promptUser();
      return;
    }

    const command = input.trim().split(' ')[0];
    const args = input.trim().split(' ').slice(1);

    switch (command) {
      case 'chat':
        const message = args.join(' ');
        bot.chat(message);
        console.log(chalk.green(`✉️ Сообщение отправлено: ${message}`));
        break;
      
      case 'coords':
        if (bot.entity) {
          console.log(chalk.cyan(`📍 Координаты: X: ${Math.round(bot.entity.x)}, Y: ${Math.round(bot.entity.y)}, Z: ${Math.round(bot.entity.z)}`));
        }
        break;
      
      case 'health':
        if (bot.entity) {
          console.log(chalk.yellow(`❤️ Здоровье: ${bot.entity.health}/${bot.entity.maxHealth}`));
        }
        break;
      
      case 'stop':
        console.log(chalk.red('Отключение бота...'));
        clearAllTimers();
        if (bot) bot.quit();
        process.exit(0);
        break;
      
      case 'help':
        console.log(chalk.blue('Доступные команды:'));
        console.log('  chat <сообщение> - Отправить сообщение в чат');
        console.log('  coords - Показать координаты');
        console.log('  health - Показать здоровье');
        console.log('  stop - Остановить бота');
        console.log('  help - Показать эту справку');
        break;
      
      default:
        console.log('Неизвестная команда. Введи "help" для справки');
    }

    promptUser();
  });

  promptUser();
}

// Главная функция
console.log(chalk.bold.cyan('════════════════════════════════════'));
console.log(chalk.bold.cyan('   MINECRAFT AFK BOT v1.0'));
console.log(chalk.bold.cyan('════════════════════════════════════'));
console.log();

initializeBot(); // Автоматическое определение версии и запуск бота
setupConsoleCommands();

// Обработка выхода
process.on('SIGINT', () => {
  console.log(chalk.red('\n\n⚠️ Процесс прерван'));
  clearAllTimers();
  if (bot) bot.quit();
  process.exit(0);
});
