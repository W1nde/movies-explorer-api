const router = require('express').Router();

const { getUser, patchUser } = require('../controllers/users');
const patchUserValidityCheck = require('../middlewares/validation')

router.get('/me', getUser);
router.patch('/me', patchUserValidityCheck, patchUser);
module.exports = router;