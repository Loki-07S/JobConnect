import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job details
        const jobRes = await API.get(`/jobs/${jobId}`);
        setJob(jobRes.data);

        // Fetch applicants
        const applicantsRes = await API.get(`/applications/applicants/${jobId}`);
        setApplicants(applicantsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs-posted')}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Jobs Posted
        </button>
        
        {job && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-1">{job.company} · {job.location} · {job.type}</p>
            <p className="text-green-600 font-medium">{job.salary}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Applicants ({applicants.length})</h3>
        </div>

        {applicants.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-lg">No applicants yet for this position.</p>
            <p className="text-sm mt-2">Share this job posting to attract more candidates!</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-4">
              {applicants.map((applicant, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{applicant.name}</h4>
                      <p className="text-gray-600">{applicant.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    {applicant.linkedin && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                        <a 
                          href={applicant.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                    
                    {applicant.github && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">GitHub:</span>
                        <a 
                          href={applicant.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {applicant.resume && (
                    <div className="mt-3">
                      <a
                        href={`http://localhost:5000${applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
