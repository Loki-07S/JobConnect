const express = require('express');
const router = express.Router();
const Application = require('../models/applicationModel');
const UserProfile = require('../models/UserProfile');

router.post('/apply', async (req, res) => {
  try {
    const { email, jobId } = req.body;

    if (!email || !jobId) {
      console.log("❌ Missing email or jobId");
      return res.status(400).json({ error: "Missing email or jobId" });
    }

    const profile = await UserProfile.findOne({ email });

    if (!profile) {
      console.log("❌ Profile not found for email:", email);
      return res.status(404).json({ error: "Profile not found" });
    }

    const existing = await Application.findOne({ jobId, email });
    if (existing) {
      console.log("⚠️ Already applied");
      return res.status(400).json({ error: "You have already applied for this job" });
    }

    const application = new Application({
      jobId,
      name: profile.name,
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
      resume: profile.resume
    });

    await application.save();
    res.json({ message: " Application submitted successfully" });
  } catch (err) {
    console.error("❌ Server error in /apply:", err);
    res.status(500).json({ error: "❌ Server error" });
  }
});



// Inside routes/applicationRoutes.js
// GET all applicants for a specific job
router.get('/applicants/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ jobId });
    res.json(applicants);
  } catch (err) {
    console.error('❌ Error fetching applicants:', err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// DELETE /api/apply/withdraw
router.delete('/withdraw', async (req, res) => {
  try {
    const { jobId, email } = req.body;
    if (!jobId || !email) return res.status(400).json({ error: "Missing jobId or email" });

    const deleted = await Application.findOneAndDelete({ jobId, email });

    if (!deleted) return res.status(404).json({ error: "Application not found" });

    res.json({ message: " Application withdrawn successfully" });
  } catch (err) {
    console.error("❌ Error withdrawing application:", err);
    res.status(500).json({ error: "❌ Failed to withdraw application" });
  }
});



module.exports = router;
