const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  patchUser
} = require('../controllers/user');

router.get('/me', getUser); // получение данных пользователя

router.patch( // обновление данных пользователя
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required(),
      // password: Joi.string().min(8).hex(),
    }),
  }),
  patchUser,
);

module.exports = router;