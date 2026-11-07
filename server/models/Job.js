const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    type: String,
    salary: String,
    description: String,
    responsibilities: [String], 
    requirements: [String],  
    website: {
  type: String,
  required: false,
},

  
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
