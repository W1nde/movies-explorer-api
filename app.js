require('dotenv').config();

const express = require('express');

const { errors } = require('celebrate'); // подключение библиотек валидации

const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser'); // подключение библиотеки для работы с телом запроса
const cookieParser = require('cookie-parser'); // подключение библиотеки для работы с куки
const helmet = require('helmet'); // модуль безопасности helmet

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// подключение бд
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

const cors = require('./middlewares/cors'); // CORS
const routes = require('./routes'); // портирование роутов
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(cors); // CORS

/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сделал бум');
  }, 0)
}); */

const errorCatcher = require('./errors/errorCatcher');

app.use(requestLogger); // логирование запросов

app.use('/', limiter); // использование лимитера

routes(app); // использование роутов

// логирование и отслеживание ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorCatcher);

app.listen(PORT);
