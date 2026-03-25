# Этап 1: Сборка приложения Vite (React)
FROM node:20-alpine as build

WORKDIR /app

# Копируем package-файлы и ставим зависимости
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копируем остальной исходный код клиента (кроме server/ - см .dockerignore)
COPY . .

# Собираем production билд
RUN npm run build


# Этап 2: Раздача статики через легковесный веб-сервер Nginx
FROM nginx:alpine

# Копируем кастомный конфиг Nginx для SPA (чтобы работал React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные файлы из предыдущего шага
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
