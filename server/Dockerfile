FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm cache clean --force && rm -rf package-lock.json node_modules && npm install
RUN npm install -g tsx typescript

# Копируем исходники сервера
COPY . .

# Приложение слушает порт 8080 (или тот, который передадим в process.env.port)
EXPOSE 8080

CMD ["npm", "start"]
