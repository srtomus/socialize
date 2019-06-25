const express = require('express');
const GroupFollowController = require('../controllers/groupFollows.controller');
const md_auth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/groupfollow', md_auth.ensureAuth, GroupFollowController.groupFollow);
router.delete('/groupUnfollow/:id', md_auth.ensureAuth, GroupFollowController.groupUnfollow);
router.get('/groupfollowing/:id/:page?', md_auth.ensureAuth, GroupFollowController.getFollowingGroups);
router.get('/groupfollowed/:id/:page?', md_auth.ensureAuth, GroupFollowController.getFollowedGroups);
router.get('/getmygroupfollows/:id/:followed?', md_auth.ensureAuth, GroupFollowController.getMyGroupFollows);
router.get('/getmygroupfollowsprofile/:id/:followed?', md_auth.ensureAuth, GroupFollowController.getMyGroupFollowsProfile);

module.exports = router;