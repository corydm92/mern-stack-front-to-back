const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

// @route   POST api/posts/
// @desc    Create new post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const { text } = req.body;

      const postOptions = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      };
      const post = new Post(postOptions);

      post.save();

      res.status(200).json(post);
    } catch (err) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Get User
    const userId = req.user.id;

    // Get Post ID
    const postId = req.params.post_id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Must use toString to match type, without post.user is type object
    if (userId !== post.user.toString()) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    } else {
      await post.remove(); // Make sure you are using the post assigned, not the Post model
    }

    res.send('Post deleted');
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Post not found' });

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    // Get post
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(400).json({ msg: 'Post not found' });

    // Check if likes array already contains user ID
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      // If not in array, like
      //
      // We need to push an object with the key value pair of user: id, becauses that is what the relationship is looking for.
      // This allows us to query subdocuments by populate('likes.user')
      post.likes.unshift({ user: req.user.id });
    } else {
      // If in array, unlike
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    }

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Post not found' });

    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:id/comments
// @desc    Comment on a post
// @access  Private
router.post(
  '/:id/comments',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get current post
      const post = await Post.findById(req.params.id);

      // Handle if no post exists
      if (!post) return res.status(400).json({ msg: 'Post not found' });

      // Get logged in user data
      const user = await User.findById(req.user.id);

      // Create comment object
      const commentObj = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      // Add comment object to comments array
      post.comments.unshift(commentObj);

      // Save post document
      post.save();

      res.json(post);
    } catch (err) {
      if (err.kind === 'ObjectId')
        return res.status(400).json({ msg: 'Post not found' });

      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/:post_id/comments/:comment_id
// @desc    Remove a comment on a post
// @access  Private
router.delete('/:post_id/comments/:comment_id', auth, async (req, res) => {
  try {
    const { post_id, comment_id } = req.params;
    const user_id = req.user.id;

    // Get current post
    const post = await Post.findById(post_id);

    // Handle if no post exists
    if (!post) return res.status(400).json({ msg: 'Post not found' });

    const comment = post.comments.filter(
      (comment) => comment.id === comment_id
    )[0]; // Need to extract entry from array

    // Handle if no comment exists
    if (!comment) return res.status(400).json({ msg: 'Comment not found' });

    console.log('user', typeof post.user);
    console.log('comment', comment['_id']);
    if (user_id !== post.user.toString() && user_id !== comment.id.toString())
      return res
        .status(401)
        .json({ msg: 'Account not authroized to remove comment' });
    // Save post document
    // post.save();

    res.json(comment);
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Post not found' });

    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
