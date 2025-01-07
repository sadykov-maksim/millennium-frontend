# Используем официальный образ Node.js
FROM node:23-alpine

# Создаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и устанавливаем зависимости
#COPY package*.json ./
#RUN npm install

# Копируем все файлы проекта
COPY . .

# Копируем SSL сертификаты в контейнер
#COPY ./ssl /etc/letsencrypt

# Строим проект
RUN npm install -g pnpm
#RUN npm install -g next
#RUN npm run build

# Открываем порт 3000 (стандартный порт Next.js)
EXPOSE 3000

# Запуск сервера с использованием HTTPS
CMD ["sh", "-c", "pnpm run dev:https --experimental-https --experimental-https-key /etc/certificates/live/mnchrm.pro/privkey.pem --experimental-https-cert /etc/certificates/live/mnchrm.pro/fullchain.pem && tail -f /dev/null"]

#CMD ["sh", "-c", "tail -f /dev/null"]