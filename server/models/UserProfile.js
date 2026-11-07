const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  role: String,
  location: String,
  skills: String,
  about: String,
  resumeUrl: String,
  linkedin: String,
  github: String,
  portfolio: String,
  resume: String,
  // Recruiter-specific fields
  company: String,
  companySize: String,
  industry: String,
  website: String,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
