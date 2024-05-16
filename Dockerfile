FROM node:20-alpine
WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install

COPY ./contracts /app/contracts
COPY ./hardhat.config.js /app/hardhat.config.js
RUN npm run build

COPY . /app
CMD ["npm", "start"]