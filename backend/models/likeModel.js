const db = require('../config/db');

const Like = {
  likePost: (postId, userId, callback) => {
    const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
    db.query(query, [postId, userId], callback);
  },

  unlikePost: (postId, userId, callback) => {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], callback);
  },

  getPostLikes: (postId, callback) => {
    const query = 'SELECT * FROM likes WHERE post_id = ?';
    db.query(query, [postId], callback);
  },

  isPostLikedByUser: (postId, userId, callback) => {
    const query = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], callback);
  },

  countLikes: (postId, callback) => {
    const query = 'SELECT COUNT(*) AS count FROM likes WHERE post_id = ?';
    db.query(query, [postId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count);
    });
  }
};

module.exports = Like;
