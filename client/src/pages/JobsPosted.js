import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const JobsPosted = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await API.delete(`/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-job/${id}`);
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/applicants/${jobId}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Jobs You Posted</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-5 rounded-lg shadow flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {job.company} · {job.location} · {job.type}
                </p>
                <p className="text-sm mb-3">{job.description}</p>
                <p className="text-green-600 font-medium">{job.salary}</p>
              </div>

              <div className="mt-4 flex justify-end gap-4 flex-wrap">
                <button
                  onClick={() => handleEdit(job._id)}
                  className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewApplicants(job._id)}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPosted;
