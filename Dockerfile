FROM node:16
WORKDIR /app

COPY package*.json ./
RUN npm install --production && tsc

COPY . .

CMD [ "npm", "start" ]
