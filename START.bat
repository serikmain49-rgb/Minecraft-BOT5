@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ════════════════════════════════════════════════════════════
echo    MINECRAFT AFK BOT - БЫСТРЫЙ СТАРТ
echo ════════════════════════════════════════════════════════════
echo.

:menu
echo Выбери действие:
echo.
echo 1. Запустить бота (быстро)
echo 2. Установить зависимости (npm install)
echo 3. Открыть конфигурацию (bot.js)
echo 4. Показать справку
echo 5. Выход
echo.
set /p choice="Введи номер (1-5): "

if "%choice%"=="1" goto run
if "%choice%"=="2" goto install
if "%choice%"=="3" goto config
if "%choice%"=="4" goto help
if "%choice%"=="5" goto exit
echo ❌ Неверный выбор!
echo.
goto menu

:run
cls
echo.
echo 🤖 Запуск бота...
echo.
node bot.js
pause
goto menu

:install
cls
echo.
echo 📦 Установка зависимостей (это может занять некоторое время)...
echo.
call npm install
echo.
echo ✅ Установка завершена!
pause
goto menu

:config
cls
echo.
echo 📝 Открываем конфигурацию...
echo.
start notepad bot.js
timeout /t 2 /nobreak
goto menu

:help
cls
echo.
echo 📚 СПРАВКА
echo ════════════════════════════════════════════════════════════
echo.
echo Перед запуском:
echo   1. Отредактируй bot.js (строка 7-13)
echo   2. Мени username на своё имя игрока
echo   3. Убедись, что IP и порт правильные
echo.
echo Команды в консоли бота:
echo   chat ^<сообщение^>  - Отправить сообщение
echo   coords           - Показать координаты
echo   health           - Показать здоровье
echo   help             - Справка
echo   stop             - Остановить бота
echo.
echo Проблемы:
echo   - Если ошибка "Cannot find module" - нажми 2 и установи зависимости
echo   - Если не подключается к серверу - проверь IP и порт
echo   - Если нужна другая версия - меняй version в bot.js
echo.
echo ════════════════════════════════════════════════════════════
pause
goto menu

:exit
exit /b
