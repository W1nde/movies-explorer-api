const Movie = require('../models/movie');

const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const ValidationError = require('../errors/ValidationError');

module.exports.createMovie = (req, res, next) => { // создание фильма
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => { // получение фильмов
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => { // удаление фильма
  Movie.findById(req.params.movieId)
    .orFail(new NotFound('Фильм не найден'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new Forbidden('Вы не можете удалить фильм сохранённый другим пользователем');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then((movieData) => {
          res.send({ data: movieData });
        })
        .catch(next);
    })
    .catch(next);
};
