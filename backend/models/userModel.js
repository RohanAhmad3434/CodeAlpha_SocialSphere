const db = require('../config/db');

// Get user by ID
exports.getUserById = (userId, callback) => {
  const sql = 'SELECT id, name, email, bio, profile_image FROM users WHERE id = ?';
  db.query(sql, [userId], callback);
};

// Get All Users
exports.getAllUsers = (callback) => {
  const query = 'SELECT id, name, bio, profile_image FROM users';
  db.query(query, callback);
};


// Update profile
exports.updateProfile = (userId, data, callback) => {
  const sql = 'UPDATE users SET name = ?, bio = ?, profile_image = ? WHERE id = ?';
  db.query(sql, [data.name, data.bio, data.profile_image, userId], callback);
};

// Follow user
exports.followUser = (followerId, followingId, callback) => {
  const sql = 'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)';
  db.query(sql, [followerId, followingId], callback);
};

// Unfollow user
exports.unfollowUser = (followerId, followingId, callback) => {
  const sql = 'DELETE FROM followers WHERE follower_id = ? AND following_id = ?';
  db.query(sql, [followerId, followingId], callback);
};

// Get followers
exports.getFollowers = (userId, callback) => {
  const sql = `
    SELECT users.id, users.name, users.bio, users.profile_image 
    FROM followers 
    JOIN users ON followers.follower_id = users.id 
    WHERE followers.following_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Get following
exports.getFollowing = (userId, callback) => {
  const sql = `
    SELECT users.id As following_id, users.name, users.bio, users.profile_image 
    FROM followers 
    JOIN users ON followers.following_id = users.id 
    WHERE followers.follower_id = ?
  `;
  db.query(sql, [userId], callback);
};
