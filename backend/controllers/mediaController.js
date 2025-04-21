const Media = require('../models/mediaModel');

exports.getPostMedia = (req, res) => {
  const postId = req.params.postId;

  Media.getMediaByPost(postId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch media' });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No media found for this post' });
    }
    
    res.status(200).json(results);
  });
};

exports.addMedia = async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ error: "Missing postId in request body" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No media files uploaded" });
  }

  try {
    let failedUploads = [];

    for (const file of req.files) {
      const filePath = `/uploads/${file.filename}`;

      await new Promise((resolve, reject) => {
        Media.saveMediaToDB(postId, filePath, (err) => {
          if (err) {
            console.error('DB Error:', err);
            failedUploads.push(file.originalname);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    if (failedUploads.length > 0) {
      return res.status(207).json({
        message: "Some media uploaded, but some failed",
        failed: failedUploads
      });
    }

    res.status(200).json({ message: 'Media uploaded successfully' });
  } catch (err) {
    console.error('Error uploading media:', err);
    res.status(500).json({ error: 'Server error uploading media' });
  }
};
