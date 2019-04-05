const express = require('express');
const UserController = require('../controllers/users.controller');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

router.get('/home', UserController.home);
router.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.post('/getuser/:id', md_auth.ensureAuth, UserController.getUser);
router.post('/getusers/:page', md_auth.ensureAuth, UserController.getUsers);
router.post('/updateuser/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = router;