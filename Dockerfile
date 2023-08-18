#########################
# Build Stage
#########################
FROM node:18-alpine as build

RUN npm install -g npm@9.8.1 node-gyp@9.4.0

WORKDIR /app

COPY package* ./
COPY tsconfig* ./

RUN npm ci

COPY ./src ./src

RUN npm run build

#########################
# Production Stage
#########################
FROM node:18-alpine as production

# Copy /app directory from build stage
COPY --from=build /app /app

# Copy env from local
COPY .env-cmdrc.json /app

# Chagne working directory
WORKDIR /app

# Start application
CMD npm run docker:env -- node ./dist/main.js

EXPOSE  3000