FROM node:16 as builder
WORKDIR '/app'
COPY ./package.json .
COPY ./tsconfig.json .
COPY src ./src
RUN npm install
RUN npm run build

FROM node:16
WORKDIR '/app'
COPY ./package.json .
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
CMD [ "npm", "run", "start" ]