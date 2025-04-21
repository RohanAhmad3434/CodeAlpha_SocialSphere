const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/like', likeController.likePost);
router.post('/unlike', likeController.unlikePost);
router.get('/:postId', likeController.getLikes);
router.post('/check', likeController.checkLikeStatus);


module.exports = router;
