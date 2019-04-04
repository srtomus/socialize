const express = require('express');
const UserController = require('../controllers/users.controller');
const router = express.Router();

router.get('/home', UserController.home);
router.get('/pruebas', UserController.pruebas);
router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);

module.exports = router;