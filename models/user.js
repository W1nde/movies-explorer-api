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
  return this.findOne({ email }, { runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized(errorMessages.loginError),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Unauthorized(errorMessages.loginError),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
