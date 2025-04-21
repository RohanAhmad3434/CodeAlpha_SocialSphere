const Post = require('../models/postModel');

exports.createPost = (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: 'Missing fields' });

  Post.create(user_id, content, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Post created', postId: result.insertId });
  });
};


exports.getAllPosts = (req, res) => {
  Post.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching posts' });

    const formattedPosts = {};

    for (const row of results) {
      if (!formattedPosts[row.id]) {
        formattedPosts[row.id] = {
          id: row.id,
          user_id: row.user_id,
          content: row.content,
          created_at: row.created_at,
          name: row.name,
          profile_image: row.profile_image,
          likes: row.likes || 0, // Add likes here
          media: []
        };
      }

      if (row.media_id) {
        formattedPosts[row.id].media.push({
          id: row.media_id,
          type: row.media_type,
          url: row.media_url
        });
      }
    }

    res.status(200).json(Object.values(formattedPosts));
  });
};


// exports.getAllPosts = (req, res) => {
//   Post.getAll((err, results) => {
//     if (err) return res.status(500).json({ error: 'Error fetching posts' });

//     const formattedPosts = {};

//     for (const row of results) {
//       if (!formattedPosts[row.id]) {
//         formattedPosts[row.id] = {
//           id: row.id,
//           user_id: row.user_id,
//           content: row.content,
//           created_at: row.created_at,
//           name: row.name,
//           profile_image: row.profile_image,
//           media: []
//         };
//       }

//       if (row.media_id) {
//         formattedPosts[row.id].media.push({
//           id: row.media_id,
//           type: row.media_type,
//           url: row.media_url
//         });
//       }
//     }

//     res.status(200).json(Object.values(formattedPosts));
//   });
// };




exports.getUserPosts = (req, res) => {
  const userId = req.params.userId;

  Post.getByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const formattedPosts = {};

    for (const row of results) {
      if (!formattedPosts[row.id]) {
        formattedPosts[row.id] = {
          id: row.id,
          user_id: row.user_id,
          content: row.content,
          created_at: row.created_at,
          name: row.name,
          profile_image: row.profile_image,
          media: []
        };
      }

      if (row.media_id) {
        formattedPosts[row.id].media.push({
          id: row.media_id,
          type: row.media_type,
          url: row.media_url
        });
      }
    }

    res.status(200).json(Object.values(formattedPosts));
  });
};

exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  Post.update(postId, content, (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Post updated' });
  });
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  Post.delete(postId, (err, result) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Post deleted' });
  });
};
