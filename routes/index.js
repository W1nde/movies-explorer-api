// единый роут
const router = require('express').Router();
const movies = require('./movies');
const users = require('./users');
const auth = require('../middlewares/auth'); // мидлвэйр авторизации
const { registrationValidationCheck, loginValidationCheck } = require('../middlewares/validation');

const NotFound = require('../errors/NotFound');
const { errorMessages } = require('../utils/errorMessages');


router.post('/signup', registrationValidationCheck, createUser);
router.post('/signin', loginValidationCheck, login);

router.use(auth, users);
router.use(auth, movies);

router.use((req, res, next) => {
  next(new NotFound(errorMessages.userNotFoundError));
});

module.exports = router;