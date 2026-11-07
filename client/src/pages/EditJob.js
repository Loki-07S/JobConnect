import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJobData(res.data);
      } catch (err) {
        console.error('Failed to load job:', err);
        alert('Error fetching job details');
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, jobData);
      alert('Job updated successfully!');
      navigate('/jobs-posted');
    } catch (err) {
      console.error('Failed to update job:', err);
      alert('Update failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Job</h1>
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
          placeholder="Location"
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
          placeholder="Salary"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          required
          placeholder="Job Description"
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        ></textarea>

        <textarea
        name="responsibilities"
        value={jobData.responsibilities}
        onChange={handleChange}
        placeholder="Responsibilities"
        rows="4"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <textarea
        name="requirements"
        value={jobData.requirements}
        onChange={handleChange}
        placeholder="Requirements"
        rows="4"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <input
        name="website"
        type="url"
        value={jobData.website}
        onChange={handleChange}
        placeholder="Company Website (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
