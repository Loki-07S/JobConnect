const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// 🔒 Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📁 Ensure resume upload directory exists
const resumeDir = path.join(__dirname, 'uploads/resumes');
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

// 📂 Serve static files (resumes)
app.use('/uploads/resumes', express.static(resumeDir));

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// 🚦 Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const applicationRoutes = require('./routes/applicationRoutes');// ⬅️ Add if you have profile upload logic

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes); // ⬅️ Add only if profile-related routes exist
app.use('/api/applications', applicationRoutes);


// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
