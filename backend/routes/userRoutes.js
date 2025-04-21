const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
// Profile
router.get('/profile', userController.getProfile);

router.get('/', userController.getAllUsers);


// Use `upload.single` to accept a single file
router.put('/profile', upload.single('profile_image'), userController.updateProfile);

  

// Follow/Unfollow
router.post('/follow', userController.follow);
router.post('/unfollow', userController.unfollow);

// Followers / Following
router.get('/followers', userController.getFollowers);
router.get('/following', userController.getFollowing);


router.get('/followers/:id', userController.getFollowers);
router.get('/following/:id', userController.getFollowing);


module.exports = router;
