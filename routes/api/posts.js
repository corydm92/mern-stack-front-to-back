const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route   GET api/posts
// @desc    Test Route
// @access  Public
router.get('/', (req, res) => res.send('Posts Route'));

// @route   POST api/posts/
// @desc    Create new post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);

    const { text } = req.body;

    const postOptions = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: user.id,
    };

    try {
      const post = new Post(postOptions);

      post.save();

      res.status(200).json(post);
    } catch (err) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
