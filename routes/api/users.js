const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Rergister User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name Is Required').not().isEmpty(),
    check('email', 'Valid Email Required').isEmail(),
    check('password', 'Password Must Be At Least 6 Characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // If email already exists
      const { name, email, password } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: ['User already exists with this email'] });
      }

      // Get users Gravitar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt Password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Send JWT

      res.send('User Regestered');
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

module.exports = router;
