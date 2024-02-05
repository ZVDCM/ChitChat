FROM node:18

WORKDIR /ChitChat.Chat

COPY /ChitChat.Chat/package*.json ./

RUN npm install

COPY /ChitChat.Chat .

RUN npm run build

CMD ["npm", "start"]