FROM node:16

WORKDIR '/app'

COPY ./package.json .

RUN npm install -g npm@latest
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]