FROM node:18

WORKDIR /

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY .env /

COPY . .

CMD ["make", "start"]