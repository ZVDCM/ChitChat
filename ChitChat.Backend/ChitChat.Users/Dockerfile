FROM node:18

WORKDIR /ChitChat.Users

COPY /ChitChat.Users/package*.json ./

RUN npm install

COPY /ChitChat.Users .

RUN npm run build

CMD ["npm", "start"]