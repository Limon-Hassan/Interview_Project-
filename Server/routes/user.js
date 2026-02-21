let express = require('express');
let router = express.Router();
const { register, login, getMe } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);

module.exports = router;
