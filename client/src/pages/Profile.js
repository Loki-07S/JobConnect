import React, { useState, useEffect } from 'react';
import API from '../api';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
    skills: '',
    about: '',
    linkedin: '',
    github: '',
    portfolio: '',
    resume: '',
    // Recruiter-specific fields
    company: '',
    companySize: '',
    industry: '',
    website: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');

  const userEmail = localStorage.getItem('userEmail');

  // ⏬ Load profile from DB on first load
  useEffect(() => {
    if (!userEmail) return;
    
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    API.get(`/profile/${userEmail}`)
      .then((res) => {
        if (res.data) {
          setUserData(res.data); // Load existing profile
        }
      })
      .catch((err) => {
        console.log('No profile yet');
      });
  }, [userEmail]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return setMessage("❌ Email not found. Please login again.");

    try {
      const formData = new FormData();
      if (resumeFile && userRole === 'candidate') formData.append('resume', resumeFile);
      formData.append('data', JSON.stringify({ ...userData, email: userEmail }));

      const res = await API.post('/profile', formData);
      setUserData(res.data); // Update form with fresh data
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to update profile.');
    }
  };

  // Recruiter Profile Form
  if (userRole === 'recruiter') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Recruiter Profile</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" value={userData.name} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" />
            <input name="email" value={userData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" readOnly />
            <input name="role" value={userData.role} onChange={handleChange} placeholder="Role" className="p-2 border rounded" />
            <input name="location" value={userData.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" />
            
            {/* Recruiter-specific fields */}
            <input name="company" value={userData.company} onChange={handleChange} placeholder="Company Name" className="p-2 border rounded" />
            <input name="companySize" value={userData.companySize} onChange={handleChange} placeholder="Company Size (e.g., 50-100 employees)" className="p-2 border rounded" />
            <input name="industry" value={userData.industry} onChange={handleChange} placeholder="Industry" className="p-2 border rounded" />
            <input name="website" value={userData.website} onChange={handleChange} placeholder="Company Website" className="p-2 border rounded" />
            <input name="linkedin" value={userData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" className="p-2 border rounded" />
            
            <textarea name="about" value={userData.about} onChange={handleChange} rows={3} placeholder="About your company and hiring needs..." className="p-2 border rounded col-span-2" />

            <div className="col-span-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Save Profile
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
      </div>
    );
  }

  // Candidate Profile Form
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidate Profile</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" value={userData.name} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" />
          <input name="email" value={userData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" readOnly />
          <input name="role" value={userData.role} onChange={handleChange} placeholder="Role" className="p-2 border rounded" />
          <input name="location" value={userData.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" />
          <input name="skills" value={userData.skills} onChange={handleChange} placeholder="Skills" className="p-2 border rounded" />
          <input name="linkedin" value={userData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" className="p-2 border rounded" />
          <input name="github" value={userData.github} onChange={handleChange} placeholder="GitHub Profile" className="p-2 border rounded" />
          <input name="portfolio" value={userData.portfolio} onChange={handleChange} placeholder="Portfolio Website" className="p-2 border rounded" />
          <textarea name="about" value={userData.about} onChange={handleChange} rows={3} placeholder="About you..." className="p-2 border rounded col-span-2" />

          <input type="file" accept=".pdf" onChange={handleResumeChange} className="col-span-2" />

          {userData.resume && (
            <div className="col-span-2 text-sm text-blue-600">
              Resume: <a href={`http://localhost:5000${userData.resume}`} target="_blank" rel="noreferrer" className="underline">View Resume</a>
            </div>
          )}

          <div className="col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Save Profile
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
