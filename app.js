const express = require('express');

const { celebrate, Joi, errors } = require('celebrate'); // подключение библиотек валидации

const { PORT=3000 } = process.env;

const app = express();

const bodyParser = require('body-parser'); // подключение библиотеки для работы с телом запроса
const cookieParser = require('cookie-parser'); // подключение библиотеки для работы с куки

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключение бд
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const cors = require('./middlewares/cors');
const routes = require

// авторизация
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

// отслеживание и логирование ошибок
const errorCatcher = require('./errors/errorCatcher');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NofFound');

/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сделал бум');
  }, 0)
}); */

// логирование запросов
app.use(requestLogger);

// регистрация
app.post('/signup', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);


// вход
app.post('/signin', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login)

app.use(auth);

// пути
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'))
app.all('*', (req, res, next) => {
  next (new NotFound('Ошибка 404, страница не найдена'))
});

// логирование и отслеживание ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorCatcher);

app.listen(PORT);