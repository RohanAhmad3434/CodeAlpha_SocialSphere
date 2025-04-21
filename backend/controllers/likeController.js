const Like = require('../models/likeModel');

exports.likePost = (req, res) => {
  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'Missing post_id or user_id' });
  }

  Like.isPostLikedByUser(post_id, user_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Post already liked by this user' });
    }

    Like.likePost(post_id, user_id, (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to like post' });

      Like.countLikes(post_id, (err3, count) => {
        if (err3) return res.status(500).json({ error: 'Failed to count likes' });

        res.status(201).json({ message: 'Post liked successfully', newLikeCount: count });
      });
    });
  });
};

exports.unlikePost = (req, res) => {
  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'Missing post_id or user_id' });
  }

  Like.unlikePost(post_id, user_id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to unlike post' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }

    Like.countLikes(post_id, (err2, count) => {
      if (err2) return res.status(500).json({ error: 'Failed to count likes' });

      res.status(200).json({ message: 'Post unliked successfully', newLikeCount: count });
    });
  });
};

exports.getLikes = (req, res) => {
  const postId = req.params.postId;

  Like.getPostLikes(postId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch likes' });

    res.status(200).json({ totalLikes: results.length, likes: results });
  });
};

exports.checkLikeStatus = (req, res) => {
  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'Missing post_id or user_id' });
  }

  Like.isPostLikedByUser(post_id, user_id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to check like status' });

    const liked = results.length > 0;
    res.status(200).json({ liked });
  });
};
