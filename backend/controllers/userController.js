const User = require('../models/userModel');

// View profile
exports.getProfile = (req, res) => {
  const userId = req.query.id;
  if (!userId) return res.status(400).json({ message: 'User ID required' });

  User.getUserById(userId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(result[0]);
  });
};

exports.updateProfile = (req, res) => {
  const { id, name, bio } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  const updateData = {
    name,
    bio,
    profile_image: profileImage
  };

  const cleanUpdate = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== null)
  );

  User.updateProfile(id, cleanUpdate, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Update failed' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
};



exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
    res.json(results);
  });
};


// Follow user
exports.follow = (req, res) => {
  const { followerId, followingId } = req.body;
  if (followerId === followingId) return res.status(400).json({ message: 'Cannot follow yourself' });

  User.followUser(followerId, followingId, (err) => {
    if (err) return res.status(500).json({ message: 'Follow failed or already following' });
    res.json({ message: 'Followed successfully' });
  });
};

// Unfollow user
exports.unfollow = (req, res) => {
  const { followerId, followingId } = req.body;

  User.unfollowUser(followerId, followingId, (err) => {
    if (err) return res.status(500).json({ message: 'Unfollow failed' });
    res.json({ message: 'Unfollowed successfully' });
  });
};

// GET /api/users/followers/:id
exports.getFollowers = (req, res) => {
  const userId = req.params.id;
  User.getFollowers(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to load followers' });
    res.json(results);
  });
};

// GET /api/users/following/:id
exports.getFollowing = (req, res) => {
  const userId = req.params.id;
  User.getFollowing(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to load following' });
    res.json(results);
  });
};
