const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.userSchema ({

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
    minlength: 2,
    maxlength: 30,
  },

})

module.exports = mongoose.model('user', userSchema);