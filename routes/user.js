const router = require('express').Router();
const authUser = require('../middleware/auth');
const user = require('../controllers/user');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/profile', authUser, user.getProfileDetails);
router.post('/changePassword', authUser, user.changePassword);

module.exports = router;