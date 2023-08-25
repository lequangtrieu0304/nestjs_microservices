FROM node:18-alpine

EXPOSE 8001

RUN npm i npm@latest -g

WORKDIR /apps

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]