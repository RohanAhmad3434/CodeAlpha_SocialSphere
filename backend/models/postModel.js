const db = require('../config/db');

const Post = {
  create: (userId, content, callback) => {
    const query = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
    db.query(query, [userId, content], callback);
  },


  getAll: (callback) => {
    const query = `
      SELECT 
        posts.*, 
        users.name, 
        users.profile_image, 
        media.id AS media_id, 
        media.type AS media_type, 
        media.url AS media_url,
        (
          SELECT COUNT(*) 
          FROM likes 
          WHERE likes.post_id = posts.id
        ) AS likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN media ON posts.id = media.post_id
      ORDER BY posts.created_at DESC
    `;
    db.query(query, callback);
  },
  

  getByUserId: (userId, callback) => {
    const query = `
      SELECT 
        posts.*, 
        users.name, 
        users.profile_image,
        media.id AS media_id,
        media.url AS media_url,
        media.type AS media_type
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      LEFT JOIN media ON posts.id = media.post_id
      WHERE user_id = ? 
      ORDER BY posts.created_at DESC
    `;
    db.query(query, [userId], callback);
  },
  

  update: (postId, content, callback) => {
    const checkQuery = 'SELECT * FROM posts WHERE id = ?';
    db.query(checkQuery, [postId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error('Post not found'));

      const updateQuery = 'UPDATE posts SET content = ? WHERE id = ?';
      db.query(updateQuery, [content, postId], callback);
    });
  },

  delete: (postId, callback) => {
    const checkQuery = 'SELECT * FROM posts WHERE id = ?';
    db.query(checkQuery, [postId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error('Post not found'));

      const deleteQuery = 'DELETE FROM posts WHERE id = ?';
      db.query(deleteQuery, [postId], callback);
    });
  }

};

module.exports = Post;
