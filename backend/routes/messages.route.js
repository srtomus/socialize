const express = require('express');
const MessageController = require('../controllers/message.controller');
const md_auth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/savemessage', md_auth.ensureAuth, MessageController.saveMessage);
router.get('/getmessages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
router.get('/getsentmessages/:page?', md_auth.ensureAuth, MessageController.getSentMessages);
router.get('/getunviewedmessages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
router.get('/setviewedmessages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = router;