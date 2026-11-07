const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, requireRole } = require('../middleware/auth');

// 🔷 POST a new job (Recruiter only)
router.post('/', auth, requireRole(['recruiter']), async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('❌ Error posting job:', error);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// 🔷 GET a specific job by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('❌ Error fetching job:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// 🔷 GET all jobs (Public) with optional simple skill filter
router.get('/', async (req, res) => {
  try {
    const { skills } = req.query; // comma-separated
    let query = {};

    if (skills) {
      const terms = skills.split(',').map((s) => s.trim()).filter(Boolean);
      if (terms.length > 0) {
        // naive filter: any requirement contains one of the terms (case-insensitive)
        query = {
          $or: [
            { requirements: { $elemMatch: { $regex: terms.join('|'), $options: 'i' } } },
            { responsibilities: { $elemMatch: { $regex: terms.join('|'), $options: 'i' } } },
            { description: { $regex: terms.join('|'), $options: 'i' } },
            { title: { $regex: terms.join('|'), $options: 'i' } },
          ],
        };
      }
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// 🔷 PUT update a job by ID (Recruiter only)
router.put('/:id', auth, requireRole(['recruiter']), async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedJob);
  } catch (err) {
    console.error('❌ Error updating job:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// 🔷 DELETE job by ID (Recruiter only)
router.delete('/:id', auth, requireRole(['recruiter']), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting job:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;
