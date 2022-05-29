require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/CastError');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NofFound');
const ValidationError = require('../errors/ValidationError');

const { JWT_SECRET = '2B4B6150645367566B5970337336763979244226452948404D6351655468576D' } = process.env; // псевдослучайный криптоустойчивый ключ

module.exports.createUser = (req, res, next) => { // создание пользователя
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
  }))
    .then((user) => {
      const {_id} = user;
      res.send({
        _id,
        name,
        email
      });
  })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким адресом электронной почты уже существует'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      } else {
        next(err)
      }
  });
};

module.exports.patchUser = (req, res, next) => { // обновление имени и email пользователя
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true } )
    .then((user) => res.send({ _id: user._id, name, email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      }
      nexti(err);
  });
};

module.exports.getUser = (req, res, next) => { // получение данных пользователя
  const {_id} = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Указанный пользователь не найден'));
      }
      return res.send(...user);
  })
  .cath(next)
};

module.exports.login = (req, res, next) => { // логирование
  const { email, password } = req.body;

  return User.findUserByCredentials (email, password)
    .then((user) => {
      // создание токена
      const token = jwt.sign(
        { _id: user.id },
        JWT_SECRET,
        {expiresIn: '7d' },
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
  .cath(next);
};