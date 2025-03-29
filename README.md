# <img src="public/logo192.png" alt="Xitter Logo" width="30" height="30" style="vertical-align: middle;"> Xitter Client

Xitter - это клон Twitter с ориентацией на сообщества. Данный репозиторий содержит клиентскую часть приложения, разработанную на React с TypeScript.

## Логотип

Приложение использует логотип в виде стилизованной буквы "X" в сине-бирюзовых тонах:
- `public/logo192.png` - логотип размером 192x192 пикселей
- `public/logo512.png` - логотип размером 512x512 пикселей

Логотип используется в интерфейсе приложения, в качестве favicon браузера и иконки мобильного приложения.

## Описание

Xitter позволяет пользователям:
- Публиковать твиты в разных сообществах (пространствах)
- Просматривать ленты твитов для определенных пространств или объединенную ленту
- Отвечать на твиты других пользователей
- Делиться твитами между различными пространствами
- Присоединяться к новым пространствам

## Установка и запуск

### Требования
- Node.js (версия 14.x или выше)
- npm (версия 6.x или выше) или yarn

### Шаги по установке

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-логин/xitter-client.git
cd xitter-client
```

2. Установите зависимости:
```bash
# С использованием npm
npm install

# Или с использованием yarn
yarn install
```

3. Настройте переменные окружения (опционально):
   - Создайте файл `.env` в корневой директории проекта
   - Добавьте необходимые переменные окружения:
   ```
   REACT_APP_API_URL=http://localhost:8080 # URL API сервера
   ```

4. Запустите приложение в режиме разработки:
```bash
# С использованием npm
npm start

# Или с использованием yarn
yarn start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Сборка для продакшена

Для создания оптимизированной сборки для продакшена:

```bash
# С использованием npm
npm run build

# Или с использованием yarn
yarn build
```

Собранные файлы будут доступны в директории `build`.

## Устранение типичных ошибок

### Проблема: Не найден файл index.html

```
Could not find a required file.
Name: index.html
Searched in: D:\github\xitter-client\public
```

**Решение**: Эта ошибка возникает, когда отсутствует необходимая структура файлов в директории `public`. Убедитесь, что в вашем проекте есть следующая структура:

```
public/
  ├── index.html       # Основной HTML файл
  ├── favicon.ico      # Иконка сайта
  ├── manifest.json    # Манифест веб-приложения
  └── robots.txt       # Файл для веб-сканеров
```

Если эти файлы отсутствуют, вы можете создать их вручную или переинициализировать проект с помощью команды:

```bash
npx create-react-app . --template typescript
```

### Проблема: Команда react-scripts не найдена

```
'react-scripts' is not recognized as an internal or external command
```

**Решение**: Эта ошибка указывает на то, что пакет `react-scripts` не был установлен. Попробуйте переустановить зависимости:

```bash
# Удаление node_modules
rm -rf node_modules

# Очистка кэша npm (опционально)
npm cache clean --force

# Переустановка зависимостей
npm install
```

### Проблема: Ошибки с PowerShell

Если у вас возникают проблемы с выполнением скриптов в PowerShell:

**Решение**: Попробуйте изменить политику выполнения скриптов в PowerShell (запустите PowerShell от имени администратора):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Или используйте командную строку Windows (CMD) вместо PowerShell.

## Взаимодействие с сервером

Клиент взаимодействует с сервером через REST API. Сервер должен поддерживать следующие эндпоинты:

- `GET /spaces` - получение списка пространств пользователя
- `GET /spaces/:id` - получение информации о конкретном пространстве
- `GET /spaces/:id/feed` - получение ленты твитов для пространства
- `GET /feed` - получение объединенной ленты для всех пространств пользователя
- `POST /spaces/:id/tweets` - создание нового твита
- `POST /spaces/:id/tweets/:tweetId/replies` - ответ на твит
- `POST /spaces/:id/join` - присоединение к пространству
- `POST /spaces/:id/share` - перепост твита в пространство

По умолчанию клиент предполагает, что сервер запущен на `http://localhost:8080`. Вы можете изменить этот URL с помощью переменной окружения `REACT_APP_API_URL`.

## Технологии

- React 18
- TypeScript
- React Router для маршрутизации
- Emotion для стилизации компонентов
- Axios для HTTP-запросов
- React Icons для иконок
