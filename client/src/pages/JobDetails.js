import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [applied, setApplied] = useState(false);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchJobAndProfile = async () => {
      try {
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(jobRes.data);

        if (email) {
          const profileRes = await axios.get(`http://localhost:5000/api/profile/${email}`);
          const profile = profileRes.data;
          setApplicant({
            name: profile.name,
            email: profile.email,
            linkedin: profile.linkedin,
            github: profile.github,
            resume: `http://localhost:5000${profile.resume}`
          });

          // Check if already applied
          const applicantsRes = await axios.get(`http://localhost:5000/api/applications/applicants/${id}`);

          const already = applicantsRes.data.some(app => app.email === profile.email);
          setApplied(already);
        }
      } catch (err) {
        console.error('Error fetching job/profile:', err);
      }
    };

    fetchJobAndProfile();
  }, [id, email]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
        

      await axios.post(`http://localhost:5000/api/applications/apply`, {
  jobId: id,
  email: applicant.email,
});


      setApplied(true);
      alert(" Application submitted successfully");
    } catch (err) {
        console.error("❌ Error response:", err.response);

      const errorMsg = err.response?.data?.error || 'Failed to apply';
      if (errorMsg === "You have already applied for this job") {
        alert("⚠️ You have already applied for this job.");
        setApplied(true);
      } else {
        alert(`❌ ${errorMsg}`);
      }
    }
  };

  const handleWithdraw = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/withdraw`, {
  data: {
    jobId: id,
    email: applicant.email
  }
});

      setApplied(false);
      alert("Application withdrawn");
    } catch (err) {
      alert("❌ Failed to withdraw application");
      console.error(err);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">{job.title}</h1>
      <p className="text-gray-600 mb-1">{job.company} · {job.location} · {job.type}</p>
      <p className="text-green-600 mb-4 font-medium">{job.salary}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Job Description</h2>
      <p className="text-gray-700">{job.description}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Responsibilities</h2>
      <ul className="list-disc ml-5 text-gray-700 space-y-1">
        {job.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Requirements</h2>
      <ul className="list-disc ml-5 text-gray-700 space-y-1">
        {job.requirements?.map((r, i) => <li key={i}>{r}</li>)}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Company Website</h2>
      <a href={job.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
        {job.website}
      </a>

      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Apply Now</h2>

        {!applicant ? (
          <p className="text-red-500">⚠️ Please complete your profile first before applying.</p>
        ) : applied ? (
          <div className="space-y-3">
            <p className="text-green-600 font-semibold">✅ You have applied for this job</p>
            <button
              onClick={handleWithdraw}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Withdraw Application
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Name:</strong> {applicant.name}</p>
            <p><strong>Email:</strong> {applicant.email}</p>
            <p><strong>LinkedIn:</strong> <a href={applicant.linkedin} className="text-blue-600 underline" target="_blank" rel="noreferrer">{applicant.linkedin}</a></p>
            <p><strong>GitHub:</strong> <a href={applicant.github} className="text-blue-600 underline" target="_blank" rel="noreferrer">{applicant.github}</a></p>
            <p><strong>Resume:</strong> <a href={applicant.resume} className="text-blue-600 underline" target="_blank" rel="noreferrer">View Resume</a></p>

            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
