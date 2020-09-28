const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
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

    const { text, name, avatar } = req.body;
    const userId = req.user.id;

    const payload = { text, name, avatar, user: userId };

    try {
      const post = new Post(payload);

      post.save();

      res.status(200).json(payload);
    } catch (err) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
