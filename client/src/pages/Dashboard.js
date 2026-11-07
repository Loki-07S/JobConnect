import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [stats, setStats] = useState({});
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState('');

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // Extract name from email
    if (userEmail) {
      const name = userEmail.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
    
    if (role === 'recruiter') {
      fetchRecruiterStats();
    } else if (role === 'candidate') {
      fetchRecommendedJobs();
    }
  }, []);

  const fetchRecruiterStats = async () => {
    try {
      const jobsRes = await API.get('/jobs');
      const totalJobs = jobsRes.data.length;
      
      // Calculate total applicants across all jobs
      let totalApplicants = 0;
      for (const job of jobsRes.data) {
        try {
          const applicantsRes = await API.get(`/applications/applicants/${job._id}`);
          totalApplicants += applicantsRes.data.length;
        } catch (err) {
          console.error('Failed to fetch applicants for job:', job._id);
        }
      }
      
      setStats({ totalJobs, totalApplicants });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const [jobsRes, profileRes] = await Promise.all([
        API.get('/jobs'),
        userEmail ? API.get(`/profile/${userEmail}`) : Promise.resolve({ data: null }),
      ]);
      
      const allJobs = jobsRes.data || [];
      const profile = profileRes.data || null;
      setUserProfile(profile);
      
      // Filter jobs based on role match
      let filteredJobs = allJobs;
      if (profile?.role) {
        const candidateRole = profile.role.toLowerCase();
        filteredJobs = allJobs.filter(job => {
          const jobTitle = job.title.toLowerCase();
          return jobTitle.includes(candidateRole);
        });
      }
      
      // Take first 6 jobs for display
      setRecommendedJobs(filteredJobs.slice(0, 6));
    } catch (err) {
      console.error('Failed to fetch recommended jobs', err);
    }
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="card p-6 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {change}
              </span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.includes('blue') ? 'bg-blue-100' : color.includes('green') ? 'bg-green-100' : 'bg-orange-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (userRole === 'recruiter') {
    return (
      <div className="p-8 space-y-8 animate-fadeInUp">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-blue-100 text-lg">Ready to find your next great hire?</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Jobs Posted"
            value={stats.totalJobs || 0}
            color="text-blue-600"
            change="+12% this month"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatCard
            title="Total Applications"
            value={stats.totalApplicants || 0}
            color="text-green-600"
            change="+8% this week"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Listings"
            value={stats.totalJobs || 0}
            color="text-orange-600"
            icon={
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <Link 
                to="/post-job"
                className="btn-primary w-full text-center block"
              >
                Post New Job
              </Link>
              <Link 
                to="/jobs-posted"
                className="btn-secondary w-full text-center block"
              >
                Manage Posted Jobs
              </Link>
            </div>
          </div>
          
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Insights & Tips</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>Jobs with detailed descriptions get 40% more applications</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Response within 24 hours improves candidate experience</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p>Include salary ranges to attract quality candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Candidate Dashboard
  return (
    <div className="p-8 space-y-8 animate-fadeInUp">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-green-100 text-lg">Your next career opportunity awaits</p>
          </div>
          <div className="hidden md:block">
            <svg className="w-16 h-16 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 hover:shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Find Your Next Opportunity</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Browse through thousands of job opportunities and find the perfect match for your skills and career goals.
          </p>
          <Link 
            to="/jobs"
            className="btn-primary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Jobs
          </Link>
        </div>
        
        <div className="card p-8 hover:shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Update Your Profile</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Keep your profile updated with the latest skills and experience to attract better opportunities.
          </p>
          <Link 
            to="/profile"
            className="btn-secondary inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
          </div>
          {userProfile?.role && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Based on: <span className="font-medium">{userProfile.role}</span>
            </span>
          )}
        </div>
        
        {recommendedJobs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 mb-2 text-lg">No jobs found matching your profile</p>
            <p className="text-gray-400">Update your role in your profile to see relevant opportunities</p>
            <Link to="/profile" className="btn-primary mt-4 inline-block">
              Update Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                    <span className="text-blue-600 font-semibold text-sm">
                      {job.company?.charAt(0) || 'C'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{job.company}</span> • {job.location} • {job.type}
                </p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {(job.description || '').slice(0, 120)}...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                  <Link 
                    to={`/jobs/${job._id}`} 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
