const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

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

// @route   POST api/profile/
// @desc    Create or Update User Profile Route
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status Is Required').not().isEmpty(),
      check('skills', 'Skils are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status, // required
      githubusername,
      skills, // required
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.status = status;
    profileFields.skills = skills.split(',').map((skill) => skill.trim());

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.social = {}; // Initialize object to pack social values

    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create

      profile = new Profile(profileFields);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// @route   GET api/profile/
// @desc    Get all user profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.params.user_id, // Specifiy 'user' instead of 'user._id' because user is just the id in the model. We bring out user id/name/avatar in populate.
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found.' });

    res.status(200).json(profile);
  } catch (err) {
    if (err.kind === 'ObjectId')
      // Returns custom message if passing in an ID that is not valid `ex: /user/abc`
      return res.status(400).json({ msg: 'Profile not found.' });

    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/user/:user_id
// @desc    Delete user, profile, and posts
// @access  Private
router.delete('/user/:user_id', auth, async (req, res) => {
  try {
    // @todo - Delete User Posts

    // Delete User Profile
    await Profile.findOneAndDelete(req.user.id);

    // Delete User
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ msg: 'Deleted User' });
  } catch (err) {}
});

module.exports = router;
