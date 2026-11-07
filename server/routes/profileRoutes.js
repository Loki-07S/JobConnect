const express = require('express');
const multer = require('multer');
const path = require('path');
const UserProfile = require('../models/UserProfile'); // ✅ Make sure this model exists

const router = express.Router();

// Storage setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST route to create/update user profile
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const userData = JSON.parse(req.body.data);
    if (req.file) {
      userData.resume = `/uploads/resumes/${req.file.filename}`;
    }

    const updated = await UserProfile.findOneAndUpdate(
      { email: userData.email },
      userData,
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('❌ Error saving profile:', err);
    res.status(500).json({ message: 'Failed to save profile', error: err.message });
  }
});

// GET user profile by email
router.get('/:email', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
