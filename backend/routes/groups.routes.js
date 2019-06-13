const express = require('express');
const GroupController = require('../controllers/groups.controller');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/groups'});

router.post('/savegroup', md_auth.ensureAuth, GroupController.saveGroup);
router.get('/getgroups/:page?', md_auth.ensureAuth, GroupController.getGroups);
router.get('/getgroup/:id', md_auth.ensureAuth, GroupController.getGroup);
router.delete('/deletegroup/:id', md_auth.ensureAuth, GroupController.deleteGroup);
router.post('/groupimg/:id', [md_auth.ensureAuth, md_upload], GroupController.groupImage);
router.get('/getinterestedgroups/', [md_auth.ensureAuth, md_upload], GroupController.getInterestedGroups);
router.get('/getgroupimg/:imageFile', GroupController.getGroupImg);

module.exports = router;