require('dotenv').config();

const express = require('express');

const { errors } = require('celebrate'); // подключение библиотек валидации

const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser'); // подключение библиотеки для работы с телом запроса
const cookieParser = require('cookie-parser'); // подключение библиотеки для работы с куки
const helmet = require('helmet'); // модуль безопасности helmet

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// подключение бд
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const cors = require('./middlewares/cors'); // CORS
const router = require('./routes/index'); // портирование роутов
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorMessages } = require('./utils/errorMessages');

app.use(cors); // CORS

/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сделал бум');
  }, 0)
}); */

const errorCatcher = require('./errors/errorCatcher');

app.use(requestLogger); // логирование запросов

app.use(limiter); // использование лимитера

app.use('/', router); // использование роутов

// логирование и отслеживание ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorCatcher);

app.listen(PORT);
