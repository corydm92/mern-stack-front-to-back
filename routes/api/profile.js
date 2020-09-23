const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//
const { check, validationResult } = require('express-validator');

//

// @route   GET api/profile/me
// @desc    Get Current User Profile Route
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error');
  }
});

// router.post(
//   '/',
//   [
//     check('status', 'Status Is Required').not.isEmpty(),
//     check('skills', 'Skils are required').not.isEmpty(),
//   ],
//   async (req, resp) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//     } catch (err) {}
//   }
// );

module.exports = router;
