const express = require('express');
const GroupFollowController = require('../controllers/groupFollows.controller');
const md_auth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/groupfollow', md_auth.ensureAuth, GroupFollowController.saveFollow);
router.delete('/groupfollowdelete/:id', md_auth.ensureAuth, GroupFollowController.unFollow);
router.get('/groupfollowing/:id/:page?', md_auth.ensureAuth, GroupFollowController.getFollowingGroups);
router.get('/groupfollowed/:id/:page?', md_auth.ensureAuth, GroupFollowController.getFollowedGroups);
router.get('/getmygroupfollows/:followed?', md_auth.ensureAuth, GroupFollowController.getMyGroupFollows);

module.exports = router;