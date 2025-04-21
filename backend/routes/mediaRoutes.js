const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multer = require('multer');
// router.post('/add', mediaController.addMedia);
router.get('/:postId', mediaController.getPostMedia);


// Configure multer to save files to /uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
  
  // Route: /api/media/add
  router.post('/add', upload.array('media'), mediaController.addMedia);

module.exports = router;
