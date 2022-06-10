// единый роут
const movies = require('./movies');
const users = require('./users');
const auth = require('./auth'); // роут авторизации
const authMiddleware = require('../middlewares/auth'); // мидлвэйр авторизации

const NotFound = require('../errors/NotFound');

module.exports = function(app) {
  app.use('/', auth);
  app.use(authMiddleware);
  app.use('/users', users);
  app.use('/movies', movies);
  app.all('*', (req,res,next) => {
    next(new NotFound('Страница не существует'));
  });
};