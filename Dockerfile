# Указываем базовый образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD [ "node", "index.js" ]
