const express = require('express');
const FollowController = require('../controllers/follow.controller');
const md_auth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
router.delete('/followdelete/:id', md_auth.ensureAuth, FollowController.unFollow);
router.get('/following/:id/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
router.get('/followed/:id/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
router.get('/getmyfollows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);

module.exports = router;