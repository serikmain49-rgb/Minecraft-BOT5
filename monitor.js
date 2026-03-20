// Мониторинг и статистика для AFK бота
// Помогает видеть активность бота в реальном времени

class BotMonitor {
  constructor() {
    this.stats = {
      startTime: new Date(),
      totalClicks: 0,
      totalRotations: 0,
      totalMoves: 0,
      totalJumps: 0,
      lastAction: null,
      currentHealth: 20,
      currentFood: 20,
      deathCount: 0,
      respawnCount: 0,
      messagesCount: 0,
      lastCoords: { x: 0, y: 0, z: 0 }
    };
  }

  // Обновить статистику
  recordClick() {
    this.stats.totalClicks++;
    this.stats.lastAction = 'Click';
    this.printStats();
  }

  recordRotation() {
    this.stats.totalRotations++;
    this.stats.lastAction = 'Rotation';
  }

  recordMove() {
    this.stats.totalMoves++;
    this.stats.lastAction = 'Movement';
  }

  recordJump() {
    this.stats.totalJumps++;
    this.stats.lastAction = 'Jump';
  }

  recordDeath() {
    this.stats.deathCount++;
  }

  recordRespawn() {
    this.stats.respawnCount++;
  }

  recordMessage() {
    this.stats.messagesCount++;
  }

  updateHealth(health, food) {
    this.stats.currentHealth = health;
    this.stats.currentFood = food;
  }

  updateCoords(x, y, z) {
    this.stats.lastCoords = { x, y, z };
  }

  // Получить время работы
  getUptime() {
    const now = new Date();
    const diff = now - this.stats.startTime;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours}ч ${minutes}м ${seconds}с`;
  }

  // Вывести статистику в консоль
  printStats() {
    console.clear();
    console.log(`
╔════════════════════════════════════════════════════╗
║         📊 СТАТИСТИКА AFK БОТА              ║
╚════════════════════════════════════════════════════╝

⏱️  ВРЕМЯ РАБОТЫ:        ${this.getUptime()}
⬇️  КЛИКОВ:             ${this.stats.totalClicks}
🔄 ПОВОРОТОВ:          ${this.stats.totalRotations}
🚶 ДВИЖЕНИЙ:           ${this.stats.totalMoves}
⬆️  ПРЫЖКОВ:            ${this.stats.totalJumps}

👤 ЗДОРОВЬЕ:           ${this.stats.currentHealth}/20 ❤️
🍖 НАСЫЩЕНИЕ:          ${this.stats.currentFood}/20 🍗

💀 СМЕРТЕЙ:            ${this.stats.deathCount}
🔁 РЕСПАУНОВ:          ${this.stats.respawnCount}
💬 СООБЩЕНИЙ:          ${this.stats.messagesCount}

📍 КООРДИНАТЫ:         X: ${Math.round(this.stats.lastCoords.x)}, Y: ${Math.round(this.stats.lastCoords.y)}, Z: ${Math.round(this.stats.lastCoords.z)}
👁️  ПОСЛЕДНЕЕ ДЕЙСТВИЕ: ${this.stats.lastAction || 'Ожидание'}

════════════════════════════════════════════════════
    Статистика обновляется в реальном времени
════════════════════════════════════════════════════
    `);
  }

  // Экспортировать статистику в JSON
  exportStats() {
    return {
      uptime: this.getUptime(),
      stats: this.stats,
      exportTime: new Date().toISOString()
    };
  }

  // Вывести отчёт
  printReport() {
    const exported = this.exportStats();
    console.log('\n📋 ОТЧЁТ:');
    console.log(JSON.stringify(exported, null, 2));
  }
}

// Экспорт класса
module.exports = BotMonitor;

// ============ ПРИМЕР ИСПОЛЬЗОВАНИЯ ============
/*
const BotMonitor = require('./monitor.js');
const monitor = new BotMonitor();

// Записать действия
monitor.recordClick();
monitor.recordRotation();
monitor.recordMove();

// Обновить статистику
monitor.updateHealth(19, 18);
monitor.updateCoords(100, 64, -50);

// Вывести статистику
monitor.printStats();

// Экспортировать
monitor.printReport();
*/
