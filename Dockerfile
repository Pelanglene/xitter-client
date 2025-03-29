# Используем Node.js 18 в качестве базового образа для сборки
FROM node:18-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Используем Nginx для раздачи статических файлов в продакшене
FROM nginx:stable-alpine

# Копируем собранное приложение из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию Nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Nginx работает на порту 80
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"] 