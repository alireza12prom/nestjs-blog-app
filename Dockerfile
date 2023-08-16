#########################
# Development Stage
#########################
FROM node:18-alpine as development

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

WORKDIR /app

COPY package*.json ./
COPY .env-cmdrc.json ./

# Copy installed packages and build directory from development stage
COPY --from=development ./app/dist/ ./dist/
COPY --from=development ./app/node_modules/ ./node_modules/

# Start application
CMD npm run docker:env -- node ./dist/main.js

EXPOSE  3000