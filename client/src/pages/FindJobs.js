import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          API.get('/jobs'),
          userEmail ? API.get(`/profile/${userEmail}`) : Promise.resolve({ data: null }),
        ]);
        
        const allJobs = jobsRes.data || [];
        const userProfile = profileRes.data || null;
        
        // Filter jobs based on role match
        let filteredJobs = allJobs;
        if (userProfile?.role) {
          const candidateRole = userProfile.role.toLowerCase();
          filteredJobs = allJobs.filter(job => {
            const jobTitle = job.title.toLowerCase();
            return jobTitle.includes(candidateRole);
          });
        }
        
        setJobs(filteredJobs);
        setProfile(userProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Find Jobs</h1>
        {profile?.role ? (
          <div className="text-sm text-gray-600">
            Showing jobs matching your role: <span className="font-medium text-gray-800">{profile.role}</span>
          </div>
        ) : (
          <div className="text-sm text-orange-600">
            Add your role in your profile to see relevant jobs
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No jobs found matching your role</p>
          <p className="text-gray-400 text-sm">Try updating your role in your profile or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {job.company} · {job.location} · {job.type}
              </p>
              <p className="text-sm text-gray-600 mt-1">{(job.description || '').slice(0, 140)}...</p>

              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Key requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 5).map((req, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-green-600">{job.salary}</span>
                <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                  Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindJobs;
