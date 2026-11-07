const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['candidate', 'recruiter'], default: 'candidate' },
  bio: String,
  linkedin: String,
  skills: [String],
  wallet: String,
})

module.exports = mongoose.model('User', UserSchema)
