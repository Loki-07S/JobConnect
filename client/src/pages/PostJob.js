import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import MultiInputField from '../components/MultiInputField';

const PostJob = () => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
    responsibilities: [],
    requirements: [],
    website: '',
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', jobData);
      alert('Job posted successfully!');
      setJobData({
        title: '',
        company: '',
        location: '',
        type: 'Full-Time',
        salary: '',
        description: '',
        responsibilities: [],
        requirements: [],
        website: '',
      });
      navigate('/jobs-posted');
    } catch (error) {
      console.error('Job posting failed:', error);
      alert('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a Job</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-5"
      >
        <input
          name="title"
          value={jobData.title}
          onChange={handleChange}
          required
          placeholder="Job Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="company"
          value={jobData.company}
          onChange={handleChange}
          required
          placeholder="Company Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="location"
          value={jobData.location}
          onChange={handleChange}
          required
          placeholder="Location (e.g., Remote, Chennai)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <select
          name="type"
          value={jobData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <input
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          placeholder="Salary (e.g., ₹10L – ₹15L PA)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          required
          placeholder="Job Description"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        ></textarea>

        {/* Responsibilities */}
        <MultiInputField
          title="Responsibilities"
          values={jobData.responsibilities}
          onChange={(updated) => setJobData({ ...jobData, responsibilities: updated })}
        />

        {/* Requirements */}
        <MultiInputField
          title="Requirements"
          values={jobData.requirements}
          onChange={(updated) => setJobData({ ...jobData, requirements: updated })}
        />

        <input
          name="website"
          value={jobData.website}
          onChange={handleChange}
          placeholder="Company Website (https://example.com)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
