const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const Unauthorized = require('../errors/Unauthorized');

// модель пользователя

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный адрес электронной почты',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// поиска пользователя
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неверно указана почта и/или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неверно указана почта и/или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
