const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.string().required(),
      year: Joi.number().required().min(4),
      description: Joi.string().required(),
      image: Joi.string().required(),
      trailerLink: Joi.string().required(),
      thumbnail: Joi.string().required(),
      owner: Joi.string().required(),
      moviedId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:moviedId',
  celebrate({
    params: Joi.object().keys({
      moviedId: Joi.string().length(24).hex().required
    }),
  }),
  deleteMovie,
);

module.exports = router;