// отдельный роут авторизации
const router = require('express').Router();
const {
  login,
  createUser,
  signOut
} = require('../controllers/users') // методы регистрации, логирования, выхода
const { registrationValidationCheck, loginValidationCheck } = require('../middlewares/validation'); // проверка ваалидности данных регистрации и авторизации

router.post('/signup', registrationValidationCheck, createUser);
router.post('/signin', loginValidationCheck, login);
router.get('/signout', signOut);

module.exports = router;
