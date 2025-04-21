const db = require('../config/db');

const Media = {
  // Add media (image or video) linked to a post
  addMedia: (postId, type, url, callback) => {
    if (!postId || !type || !url) {
      return callback(new Error('Missing media fields'));
    }

    const query = 'INSERT INTO media (post_id, type, url) VALUES (?, ?, ?)';
    db.query(query, [postId, type, url], callback);
  },

  // Get all media items for a specific post
  getMediaByPost: (postId, callback) => {
    if (!postId || isNaN(postId)) {
      return callback(new Error('Invalid post ID'));
    }

    const query = 'SELECT * FROM media WHERE post_id = ?';
    db.query(query, [postId], callback);
  },

    // Save media info to DB
    saveMediaToDB: (postId, filePath, callback) => {
      const fileExtension = filePath.split('.').pop().toLowerCase();
      let type;
  
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        type = 'image';
      } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
        type = 'video';
      } else {
        return callback(new Error('Unsupported media type'));
      }
  
      const query = 'INSERT INTO media (post_id, type, url) VALUES (?, ?, ?)';
      db.query(query, [postId, type, filePath], callback);
    },
  

};

module.exports = Media;
