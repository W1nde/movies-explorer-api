// вайтлист CORS-запросов
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

module.exports = {allowedCors, errMessages };