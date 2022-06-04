const router = require('express').Router();
const { login, createUser, signOut } = require('../controllers/users');
const { registrationValidationCheck, loginValidationCheck } = require('../middlewares/validation');

router.post('/signup', registrationValidationCheck, createUser);

router.post('/signin', loginValidationCheck, login);

router.get('/signout', signOut);

module.exports = router;