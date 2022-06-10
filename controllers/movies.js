const Movie = require('../models/movie');

const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const ValidationError = require('../errors/ValidationError')

module.exports.createMovie = (req, res, next) => { // создание фильма
  const {
    country,
    director,
    durtion,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body; // беру параметры фильма из тела запроса

  const owner = req.user_id; // присваиваю параметру 'owner' id юзера

  Movie.create({
    country,
    director,
    durtion,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  }) // создаю массив из полученных ранее объектов
    .then((movie) => res.send(movie)) // передаю фильм в респонс
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'))
      } else {
        next(err)
    }
  })
};

module.exports.getMovies = (req, res, next) => { // получение фильма
  Movie.find({})
    .then((movies) => res.send(movies))
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
