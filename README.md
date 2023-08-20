<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center"> 🔬 Technologies 🔬 </h1>

<ul>
  <li>Nestjs</li>
  <li>TypeORM</li>
  <li>PostgreSQL</li>
  <li>Jest</li>
  <li>Swagger</li>
  <li>Docker & Docker-Compose</li>
  <li>Github CI</li>
</ul>

<h1 align="center"> 📦 Install 📦 </h1>

Clone the repository and run below command:

```
npm install
```

<h1 align="center">  🔨 ENV 🔨  </h1>

Create a `.env-cmdrc.json` in the root project.

```
{
  "development": {
    "DB_PORT": "",
    "DB_PASS": "",
    "DB_USER": "",
    "DB_NAME": "",
    "DB_HOST": "",
    "JWT_SECRET": "",
    "ADMIN_SESSION_EXPIRE_AFTER_DAYS": "",
    "USER_SESSION_EXPIRE_AFTER_DAYS": "",
    "MAX_USER_ACTIVE_SESSION": "",
    "MAX_ADMIN_ACTIVE_SESSION": "",
    "MIN_PASSWORD_LENGTH": "",
    "UPLOAD_DIR": "",
    "MAX_AVATAR_SIZE_MB": ""
  },
  "docker": {
    "JWT_SECRET": "",
    "ADMIN_SESSION_EXPIRE_AFTER_DAYS": "",
    "USER_SESSION_EXPIRE_AFTER_DAYS": "",
    "MAX_USER_ACTIVE_SESSION": "",
    "MAX_ADMIN_ACTIVE_SESSION": "",
    "MIN_PASSWORD_LENGTH": "",
    "UPLOAD_DIR": "",
    "MAX_AVATAR_SIZE_MB": ""
  },
  "test": {
    "UPLOAD_DIR": "",
    "MAX_ACTIVE_SESSION": "",
    "JWT_SECRET": "",
    "MAX_ADMIN_ACTIVE_SESSION": ""
  }
}
```

> NOTE: If you want to run your project with docker, just set `docker` environment and to run tests, set `test` environment.

<h1 align="center">  🐋 Run With Docker  🐋  </h1>

Please make sure you have installed docker in your machine and then run below command:

```
docker compose up --build
```

<h1 align="center">	🧪 Run Tests 🧪 </h1>

> NOTE: To run tests manually, make sure you set environment variables for `test`.

To run all tests:

```
npm run test
```

And to get the code coverage:

```
npm run test:cov
```

<h1 align="center"> 📒 Docuemnt 📒 </h1>

Swagger is available in `http://<host>:<port>/docs`.
