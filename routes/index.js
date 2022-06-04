// единый роут
const authorization = require('./auth'); // routes/auth
const movies = require('./movies');
const users = require('./users');
const auth = require('../middlewares/auth'); // middlewares/auth

const NotFound = require('../errors/NotFound');
const { errorMessages } = require('../utils/errorMessages');

module.exports = function (app) {
  app.use('/', authorization);
  app.use(auth);
  app.use('/users', users);
  app.use('/movies', movies);
  app.all('*', (req, res, next) => {
    next(new NotFound(errorMessages.wrongPathError));
  });
};