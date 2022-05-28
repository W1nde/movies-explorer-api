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

const { login, createUser } = require('./controllers/users')
const auth = require('./middlewares/auth')