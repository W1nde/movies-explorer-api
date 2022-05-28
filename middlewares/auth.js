require('dotenv').config();

const Unauthorized = require('../errors/Unauthorized');

const jwt = require('jsonwebtoken');

const { JWT_SECRET = '2B4B6150645367566B5970337336763979244226452948404D6351655468576D' } = process.env

module.exports = (req, res, next) => {
  const authorization =
  req.cookies.jwt || req.headers.authorization.replace('Bearer ', '');
  if (!authorization) {
    return next(new Unauthorized('Ошибка авторизации'));
  }
  let payload;
  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) {
    return next (new Unauthorized('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};