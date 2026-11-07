const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { auth } = require('../middleware/auth')

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hash, role: role || 'candidate' })
    res.json({ message: 'Registration successful' })
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data' })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
  res.json({ token, user })
})

// Validate token
router.get('/validate', auth, async (req, res) => {
  try {
    // If we reach here, the auth middleware has already validated the token
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    res.json({ valid: true, user })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router
