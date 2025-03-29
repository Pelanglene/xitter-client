# <img src="public/logo192.png" alt="Xitter Logo" width="30" height="30" style="vertical-align: middle;"> Xitter Client

Xitter - это клон Twitter с ориентацией на сообщества. Данный репозиторий содержит клиентскую часть приложения, разработанную на React с TypeScript.

## Описание

Xitter позволяет пользователям:
- Публиковать твиты в разных сообществах (пространствах)
- Просматривать ленты твитов для определенных пространств или объединенную ленту
- Отвечать на твиты других пользователей
- Делиться твитами между различными пространствами
- Присоединяться к новым пространствам

### Деплой на GitHub Pages

Вы можете попробовать проект на GitHub Pages

https://pelanglene.github.io/xitter-client/

Для того чтобы попробовать от лица пользователя с твитом, нужно ввести логин alice и произвольный пароль

## Установка и запуск

### Запуск с использованием Docker

```bash
docker-compose up -d
```

Приложение будет доступно по адресу [http://localhost:80](http://localhost:80).

### Запуск cо сборкой локально

#### Требования
- Node.js (версия 14.x или выше)
- npm (версия 6.x или выше)

#### Шаги по установке

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-логин/xitter-client.git
cd xitter-client
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения (опционально):
   - Создайте файл `.env` в корневой директории проекта
   - Добавьте необходимые переменные окружения:
   ```
   REACT_APP_API_URL=http://localhost:8080 # URL API сервера
   ```

4. Запустите приложение в режиме разработки:
```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

#### Сборка для продакшена

Для создания оптимизированной сборки для продакшена:

```bash
npm run build
```

Собранные файлы будут доступны в директории `build`.

## Технологии

- React 18
- TypeScript
- React Router для маршрутизации
- Emotion для стилизации компонентов
- Axios для HTTP-запросов
- React Icons для иконок

## Скриншоты

### Страница входа
![Страница входа](/screenshots/login.png)

### Главная страница
Главная страница содержит ленту твитов из всех пространств, на которые подписан пользователь.
![Главная страница](/screenshots/home_page.png)

### Выбор пространства для создания твита
Чекбоксы с выбором пространства для написания твита.
![Страница пространства](/screenshots/choose_space_to_tweet.png)

### Ваши пространства
Список пространств, на которые подписан пользователь.
![Ваши пространства](/screenshots/your_spaces.png)

### Страница пространства
Детальная информация о пространстве и лента твитов в этом пространстве.
![Страница пространства](/screenshots/space.png)

### Профиль пользователя
Профиль авторизованного пользователя с возможностью редактирования данных.
![Профиль пользователя](/screenshots/your_user.png)

### Профиль другого пользователя
Просмотр профиля другого пользователя.
![Профиль другого пользователя](/screenshots/another_user.png)

### Пространство (неавторизованный пользователь)
Как выглядит пространство для неавторизованного пользователя.
![Пространство (неавторизованный)](/screenshots/space_not_authorized.png)
