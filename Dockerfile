FROM node:18.14.2-buster-slim as dev
WORKDIR /app
COPY package.json package.json
RUN npm install
CMD [ "npm", "run", "start:dev"]


FROM node:18.14.2-buster-slim as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --frozen-lockfile


FROM node:18.14.2-buster-slim as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN npm test
RUN npm run build

FROM node:18.14.2-buster-slim as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --prod --frozen-lockfile


FROM node:18.14.2-buster-slim as prod
EXPOSE 3000
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js"]









