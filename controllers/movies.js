const Movie = require('../models/movie');

const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const { errorMessages } = require('../utils/errorMessages');

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
    .then((movie) => res.send(movie)) // передаю фильм в ответ
    .catch(next);
};

module.exports.getMovies = (req, res, next) => { // получение фильма
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => { // удаление фильма
  Movie.findById(req.params.movieId)
    .orFail()
    .catch(() => new NotFound(errorMessages.movieNotFoundError))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new Forbidden(errorMessages.deleteMovieError);
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then((movieData) => {
          res.send({ data: movieData });
        })
        .catch(next);
    })
    .catch(next);
};
