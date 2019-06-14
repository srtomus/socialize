const express = require('express');
const UserController = require('../controllers/users.controller');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

const router = express.Router();
const md_upload = multipart({uploadDir: './uploads/users'});

router.get('/home', UserController.home);
router.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.get('/getuser/:id', md_auth.ensureAuth, UserController.getUser);
router.get('/getusers/:page?', md_auth.ensureAuth, UserController.getUsers);
router.put('/updateuser/:id', md_auth.ensureAuth, UserController.updateUser);
router.post('/uploadimage/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
router.get('/getimageuser/:imageFile', UserController.getUserImg);
router.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
router.delete('/deleteuser/:id?', md_auth.ensureAuth, UserController.deleteUser);

module.exports = router;