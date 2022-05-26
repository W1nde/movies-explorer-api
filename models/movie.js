const mongoose = require('mongoose');
const { default: isURL } = require('validator/lib/isURL');

const movieSchema = new mongoose.Shema ({

  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
    length: 4,
  },

  description: {
    type: String,
    required: true,
    // минимальная и максимальная длинна?
    minlength: 30,
    maxlength: 250,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректная ссылка на постер',
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректная ссылка на трейлер',
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректная ссылка на миниатюру',
    },
  },

  owner: {
    type: mongoose.Shema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  moviedId: {
    type: mongoose.Shema.Types.ObjectId,
    required: true,
    // ref ???
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  }

})