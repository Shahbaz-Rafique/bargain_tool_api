const express = require('express');
const { login, register, verifyUser, verifyLatestCode, validateUser } = require('../controllers/auth');
const { updateUser, getUser, getUsers, deleteUser } = require('../controllers/user');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/authentication', validateUser)
router.get('/:email', getUser);
router.get('/users', getUsers);
router.put('/:Id', updateUser);

module.exports = router;