const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send('User Route');
  }
);

module.exports = router;
