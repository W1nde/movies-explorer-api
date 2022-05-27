const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  patchUser
} = require('../controllers/users');

router.get('/me', getUser);

router.patch(
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