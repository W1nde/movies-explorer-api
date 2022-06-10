const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/CastError');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const ValidationError = require('../errors/ValidationError');

const { JWT_SECRET = '2B4B6150645367566B5970337336763979244226452948404D6351655468576D' } = process.env; // псевдослучайный криптоустойчивый ключ

module.exports.createUser = (req, res, next) => { // создание пользователя
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.send({
        _id,
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict({ message: 'Пользователь с таким E-mail уже зарегестрирован' }));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => { // обновление имени и email пользователя
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((user) => res.send({ _id: user._id, name, email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: 'Введены некорректные данные' }));
      }
      if (err.name === 'CastError') {
        next(new CastError({ message: 'Введены некорректные данные' }));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => { // получение данных пользователя
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return next(new NotFound({ message: 'Данный пользователь не найден' }));
      }
      return res.send(...user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => { // логирование
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создание токена
      const token = jwt.sign(
        { _id: user.id },
        JWT_SECRET, // 2B4B6150645367566B5970337336763979244226452948404D6351655468576D
        { expiresIn: '7d' },
      );
      // кукирование токена
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      // возвращение токена
      res.send({ token });
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы вышли из аккаунта' });
};
