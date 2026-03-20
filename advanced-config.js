// Продвинутая анти-AFK конфигурация для разных типов серверов
// Выбери конфиг в зависимости от типа сервера

const PRESETS = {
  // 1. Стандартный сервер (рекомендуется)
  standard: {
    name: 'Стандартный сервер',
    description: 'Для обычных серверов с базовым анти-кик',
    clickInterval: 15000,
    rotateInterval: 20000,
    moveInterval: 40000,
    jumpInterval: 60000,
    inventoryCheckInterval: 120000
  },

  // 2. Строгий сервер (много анти-чит модов)
  strict: {
    name: 'Строгий сервер',
    description: 'Для серверов с анти-чит системами (PaperMC, Spigot)',
    clickInterval: 8000,     // Чаще клики
    rotateInterval: 12000,   // Чаще повороты
    moveInterval: 25000,     // Меньше стояния на месте
    jumpInterval: 45000,
    inventoryCheckInterval: 180000
  },

  // 3. PvP сервер
  pvp: {
    name: 'PvP сервер',
    description: 'Для PvP серверов с агрессивным анти-AFK',
    clickInterval: 5000,
    rotateInterval: 8000,
    moveInterval: 15000,
    jumpInterval: 30000,
    inventoryCheckInterval: 60000,
    swingArmInterval: 3000   // Дополнительно размахивание рукой
  },

  // 4. Aternos и лагичные серверы
  aternos: {
    name: 'Aternos/Лагичные серверы',
    description: 'Для серверов с лагом и перегрузками',
    clickInterval: 20000,    // Меньше нагрузки
    rotateInterval: 25000,
    moveInterval: 50000,
    jumpInterval: 75000,
    inventoryCheckInterval: 240000,
    delayResponses: 2000     // Задержка между действиями
  },

  // 5. Минимальный режим (мало ресурсов)
  minimal: {
    name: 'Минимальный режим',
    description: 'Для слабых ПК или стабильных серверов',
    clickInterval: 30000,
    rotateInterval: 45000,
    moveInterval: 60000,
    jumpInterval: 120000,
    inventoryCheckInterval: 300000
  }
};

// Дополнительные стратегии против анти-чит систем
const ANTI_CHEAT_STRATEGIES = {
  // Случайные интервалы вместо фиксированных
  randomizeIntervals: {
    enabled: true,
    variance: 0.3, // 30% случайной вариации
    description: 'Добавляет ±30% к интервалам, чтобы не быть слишком предсказуемым'
  },

  // Случайное движение вместо повторяющегося
  randomMovement: {
    enabled: true,
    description: 'Случайный выбор направления вместо одного и того же'
  },

  // Случайное открытие/закрытие функций
  randomActivityMix: {
    enabled: true,
    description: 'Случайное чередование различных действий'
  },

  // Имитация реального поведения
  naturalBehavior: {
    enabled: true,
    sleepAfter: 3600000, // Ложиться спать через 1 час (для ночных серверов)
    description: 'Периодически "спит", чтобы выглядеть как реальный игрок'
  },

  // Чередование позиций
  positionRotation: {
    enabled: true,
    rotatePositions: [
      { x: 0, z: 0 },      // Центр
      { x: 5, z: 0 },      // Вправо
      { x: -5, z: 0 },     // Влево
      { x: 0, z: 5 },      // Вперёд
      { x: 0, z: -5 }      // Назад
    ],
    description: 'Медленное передвижение по определённым точкам'
  }
};

// Функция для вывода рекомендаций
function getRecommendation(serverType) {
  const preset = PRESETS[serverType];
  if (!preset) {
    console.error('❌ Тип сервера не найден!');
    console.log('Доступные типы: ' + Object.keys(PRESETS).join(', '));
    return null;
  }
  
  return {
    ...preset,
    antiCheat: ANTI_CHEAT_STRATEGIES
  };
}

// Вывод всех доступных конфигов
function listAllPresets() {
  console.log('\n📋 Доступные конфигурации:\n');
  
  Object.entries(PRESETS).forEach(([key, config], index) => {
    console.log(`${index + 1}. ${config.name}`);
    console.log(`   Описание: ${config.description}`);
    console.log(`   Интервалы: клик=${config.clickInterval}мс, движение=${config.moveInterval}мс\n`);
  });
}

module.exports = {
  PRESETS,
  ANTI_CHEAT_STRATEGIES,
  getRecommendation,
  listAllPresets
};

// ============ ИСПОЛЬЗОВАНИЕ ============
// Раскомментируй для быстрого тестирования:

/*
const config = require('./advanced-config.js');
config.listAllPresets();
console.log('\n📌 Рекомендация для твоего сервера:');
console.log(config.getRecommendation('aternos'));
*/
