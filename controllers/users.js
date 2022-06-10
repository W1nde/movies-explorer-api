const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');


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
        next(new Conflict('Пользователь с таким E-mail уже зарегестрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  const findAndModify = () => User.findByIdAndUpdate( // найти и модифицировать объект бд
    req.user._id,
    { name, email },
    { runValidators: true },
  )
  User.find({ email })
    .then(([user]) => {
      if (user && user._id !== req.user._id) {
        throw new Conflict('Пользователь с таким E-mail уже зарегестрирован')
    }
    return findAndModify() // вернуть модифицированный объект бд
  })
    .then(() => {
      res.send({ name, email, });
    })
    .catch(next)
};

module.exports.getUser = (req, res, next) => { // получение данных пользователя
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Данный пользователь не найден'));
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
