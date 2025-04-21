document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Please login to view the feed.");
    window.location.href = "login.html";
  }
});

const userId = localStorage.getItem('userId');

async function fetchPosts() {
  try {
    const res = await fetch('http://localhost:3000/api/posts/all');
    const posts = await res.json();

    const feedDiv = document.getElementById('feed');
    feedDiv.innerHTML = '';

    posts.forEach(displayPost);
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
}

function displayPost(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'card shadow-sm mb-4';

  const mediaHtml = post.media.map(file => {
    if (file.type === 'image') {
      return `<img src="http://localhost:3000${normalizePath(file.url)}" class="img-fluid rounded mt-2" alt="post-image">`;
    } else if (file.type === 'video') {
      return `<video src="http://localhost:3000${normalizePath(file.url)}" controls class="w-100 rounded mt-2"></video>`;
    } else {
      return '';
    }
  }).join('');

  const profileImageUrl = post.profile_image 
    ? `http://localhost:3000${normalizePath(post.profile_image)}` 
    : 'default-profile.png';

  postDiv.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <img src="${profileImageUrl}" class="rounded-circle me-2 border" style="width: 40px; height: 40px;" alt="profile">
        <strong>${post.name}</strong>
      </div>
      <p class="card-text">${post.content.replace(/\n/g, '<br>')}</p>
      <div class="media">${mediaHtml}</div>
      <div class="mt-3">
        <button class="btn btn-outline-danger btn-sm like-btn me-2" data-id="${post.id}">❤️ Like</button>
        <span id="likes-${post.id}" class="like-count fw-semibold">${post.likes || 0} likes</span>
      </div>
      <div class="comments mt-3" id="comments-${post.id}"></div>
      <div class="input-group mt-2">
        <input type="text" class="form-control" id="comment-input-${post.id}" placeholder="Add a comment...">
        <button class="btn btn-outline-primary comment-btn" data-id="${post.id}">💬 Comment</button>
      </div>
    </div>
  `;

  document.getElementById('feed').appendChild(postDiv);

  setupLikeButton(post.id);
  setupCommentButton(post.id, userId);
  loadComments(post.id);
}

function normalizePath(path) {
  const lastSlash = path.lastIndexOf("/uploads");
  return lastSlash !== -1 ? path.slice(lastSlash) : path;
}

async function setupLikeButton(postId) {
  const btn = document.querySelector(`.like-btn[data-id="${postId}"]`);
  const likeCountSpan = document.getElementById(`likes-${postId}`);
  let isLiked = false;

  try {
    const res = await fetch('http://localhost:3000/api/likes/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, user_id: userId })
    });

    const data = await res.json();
    isLiked = data.liked;
    btn.textContent = isLiked ? '💔 Unlike' : '❤️ Like';
  } catch (err) {
    console.error('Error checking like status:', err);
  }

  btn.onclick = async () => {
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      const res = await fetch(`http://localhost:3000/api/likes/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: userId })
      });

      const data = await res.json();
      isLiked = !isLiked;
      btn.textContent = isLiked ? '💔 Unlike' : '❤️ Like';
      likeCountSpan.innerText = data.newLikeCount || 0;

      likeCountSpan.classList.add('pulse');
      setTimeout(() => likeCountSpan.classList.remove('pulse'), 300);
    } catch (err) {
      console.error('Like/unlike error:', err);
    }
  };
}

function setupCommentButton(postId, userId) {
  const btn = document.querySelector(`.comment-btn[data-id="${postId}"]`);
  btn.onclick = async () => {
    const input = document.getElementById(`comment-input-${postId}`);
    const comment = input.value.trim();
    if (!comment) return;

    try {
      await fetch(`http://localhost:3000/api/comments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId,
          comment: comment
        })
      });

      input.value = '';
      loadComments(postId);
    } catch (err) {
      console.error('Comment error:', err);
    }
  };
}

async function loadComments(postId) {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/${postId}`);
    const comments = await res.json();
    const commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.innerHTML = '';

    comments.forEach(c => {
      const p = document.createElement('p');
      p.className = 'bg-light p-2 rounded mb-1';
      p.innerText = `${c.name || 'User'}: ${c.comment}`;
      commentsDiv.appendChild(p);
    });
  } catch (err) {
    console.error('Load comments error:', err);
  }
}
