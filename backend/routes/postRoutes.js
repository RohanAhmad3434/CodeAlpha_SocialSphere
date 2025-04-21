const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create', postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/user/:userId', postController.getUserPosts);
router.put('/update/:id', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);

module.exports = router;
