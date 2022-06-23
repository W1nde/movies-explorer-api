const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  delayMs: 0,
  message: 'Превышено количество попыток сделать запрос. Попробуйте ещё раз через 15 минут',
  headers: true,
});
