const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

// модель пользователя

const userSchema = new mongoose.Schema ({
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
    select: false
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
})

module.exports = mongoose.model('user', userSchema);