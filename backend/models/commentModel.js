const db = require('../config/db');

const Comment = {
  addComment: (postId, userId, comment, callback) => {
    const query = 'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)';
    db.query(query, [postId, userId, comment], callback);
  },

  getCommentsByPost: (postId, callback) => {
    const query = `
      SELECT comments.*, users.name, users.profile_image 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE post_id = ? 
      ORDER BY comments.created_at DESC`;
    db.query(query, [postId], callback);
  }
};

module.exports = Comment;
