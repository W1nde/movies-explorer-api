const express = require('express');

const { celebrate, Joi, errors } = require('celebrate'); // подключение библиотек валидации

const { PORT=3000 } = process.env;

const app = express();

const bodyParser = require('body-parser'); // подключение библиотеки для работы с телом запроса

const cookieParser = require('cookie-parser'); // подключение библиотеки для работы с куки

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/* mongoose.connect('url', {
  useNewUrlParser: true,
}); */

// авторизация
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

// отслеживание и логирование ошибок
const errorCatcher = require('./errors/errorCatcher');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NofFound');

app.use(requestLogger);
app.use(errorLogger);
app.use(errors());
app.use(errorCatcher);

/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сделал бум');
  }, 0)
}); */

// Вайтлист CORS-запросов
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'http://movies-explorer.nomoreparties.sbs', // адрес бэкенда
  'https://movies-explorer.nomoreparties.sbs',
  'http://movies-explorer-site.nomoreparties.sbs', // адрес клиентской части
  'https://movies-explorer-site.nomoreparties.sbs',
];

// Обработка CORS-запросов
app.use ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const reqHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHOD = 'GET, HEAD, PUT, PATCH, POST, DELETE';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Acess-Controll-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHOD)
    res.header('Access-Control-Allow-Headers', reqHeaders);
    return res.end();
  }
  return next();
});

// Регистрация
app.post('/signup', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);


// Вход
app.post('/signin', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login)

app.use(auth);

// Пути
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'))
app.all('*', (req, res, next) => {
  next (new NotFound('Ошибка 404, страница не найдена'))
});

app.listen(PORT);