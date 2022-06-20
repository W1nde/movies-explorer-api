// вайтлист CORS-запросов
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'http://movies-explorer-api.nomoreparties.sbs', // адрес бэкенда
  'https://movies-explorer-api.nomoreparties.sbs',
  'http://moviesexplorer.nomoreparties.sbs', // адрес клиентской части
  'https://moviesexplorer.nomoreparties.sbs',
];

module.exports = allowedCors;
