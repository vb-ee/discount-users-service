FROM node:16 as builder
WORKDIR '/app'
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
RUN npm ci && npm cache clean --force
COPY src ./src
RUN npm run build

FROM node:16
WORKDIR '/app'
COPY ./package.json .
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
CMD [ "npm", "run", "start" ]