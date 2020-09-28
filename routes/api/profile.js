const express = require('express');
const config = require('config');
const request = require('request');
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
    await Profile.findOneAndDelete({ user: req.user.id });

    // Delete User
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ msg: 'Deleted User' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    PUT user experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is Required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('current', 'Current position is required').isBoolean(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, // Required
      company, // Required
      location,
      from, // Required
      to,
      current,
      description,
    } = req.body;

    const experienceObj = {
      title,
      company,
      location,
      from,
      to,
      current: !to ? true : current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(experienceObj); // Unshift adds object to beginning of array

      await profile.save();

      res.status(200).json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:experience_id
// @desc    DELETE user experience
// @access  Private
router.delete('/experience/:experience_id', auth, async (req, res) => {
  const userID = req.user.id;
  const experienceID = req.params.experience_id;

  try {
    // Single Method Approach
    // If using this approach, nothing below this method is used for our DELETE request
    //
    // await Profile.updateOne(
    //   { user: userID },
    //   { $pull: { experience: { _id: experienceID } } }, // Pull from the experience array an experience that matches our ID
    //   {},
    //   function (err, numAffected) {
    //     console.log(err);
    //     if (err) return res.status(400).json({ msg: err.message });
    //     return res.status(200).json(numAffected);
    //   }
    // );

    const profile = await Profile.findOne({
      user: userID,
    });

    // Using Mongoose pull method
    // profile.experience.pull(experienceID); // Pull removes a subdocument, passing in just the id of that subdocument as an arg

    profile.experience = profile.experience.reduce((acc, current) => {
      if (current.id !== experienceID) {
        return current;
      }
      return acc;
    }, []);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    PUT user education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').notEmpty(),
      check('degree', 'Degree is required').notEmpty(),
      check('fieldofstudy', 'Field of Study is required').notEmpty(),
      check('from', 'From date is required').notEmpty(),
      check('current', 'Currently Enrolled is required').isBoolean(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school, // Required
      degree, // Required
      fieldofstudy, // Required
      from, // Required
      to,
      title,
      current, // Required
      description,
    } = req.body;

    const educationObj = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      title,
      current: !to ? true : current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(educationObj); // Unshift adds object to beginning of array

      await profile.save();

      res.status(200).json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/education/:education_id
// @desc    DELETE user education
// @access  Private
router.delete('/education/:education_id', auth, async (req, res) => {
  const userID = req.user.id;
  const educationID = req.params.education_id;

  try {
    const profile = await Profile.findOne({
      user: userID,
    });

    // Using Mongoose pull method
    profile.education = profile.education.reduce((acc, current) => {
      if (current.id !== educationID) {
        return current;
      }
      return acc;
    }, []);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/github/:username
// @desc    GET user github repos
// @access  Public
router.get('/github/:username', async (req, res) => {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      'githubClientId'
    )}&client_secret=${config.get('clientSecret')}`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' },
  };

  try {
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'No profile found' });

      res.status(200).json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
