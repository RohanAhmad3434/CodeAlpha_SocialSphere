const Comment = require('../models/commentModel');

exports.addComment = (req, res) => {
  const { post_id, user_id, comment } = req.body;

  if (!post_id || !user_id || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  Comment.addComment(post_id, user_id, comment, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add comment' });
    res.status(201).json({ message: 'Comment added', commentId: result.insertId });
  });
};

exports.getPostComments = (req, res) => {
  const postId = req.params.postId;

  Comment.getCommentsByPost(postId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch comments' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post' });
    }

    res.status(200).json(results);
  });
};
