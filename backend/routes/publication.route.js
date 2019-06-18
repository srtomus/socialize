const express = require('express');
const PublicationController = require('../controllers/publications.controller');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/groups'});

router.post('/savepublication', md_auth.ensureAuth, PublicationController.savePublication);
router.get('/getpublications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
router.get('/getpublication/:id', md_auth.ensureAuth, PublicationController.getPublication);
router.delete('/deletepublication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
router.post('/publicationimg/:id', [md_auth.ensureAuth, md_upload], PublicationController.publicationImage);
router.get('/getpublicationimg/:imageFile', PublicationController.getPublicationImg);
router.get('/getPublicationsuser/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
router.get('/getmypublications/:page?', md_auth.ensureAuth, PublicationController.getMyPublications);


module.exports = router;