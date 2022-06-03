// единый роут
const users = require('./users');
const movies = require('./movies');
const authorization = require('./auth'); // routes/auth
const auth = require('../middlewares/auth'); // middlewares/auth
const NotFoundError = require('../errors/NofFound');
const { errorMessages } = require('../utils/errorMessages');

module.exports = function (app) {
  app.use('/', authorization);
  app.use(auth);
  app.use('/users', users);
  app.use('/movies', movies);
  app.all('*', (req, res, next) => {
    next(new NotFoundError(errorMessages.wrongPathError));
  });
};