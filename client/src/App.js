// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from './pages/Dashboard';
import FindJobs from './pages/FindJobs';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import EditJob from "./pages/EditJob";
import JobsPosted from './pages/JobsPosted';
import Applicants from './pages/Applicants';
import SidebarLayout from './components/SidebarLayout';
import RoleBasedRoute from './components/RoleBasedRoute';
import AuthCheck from './components/AuthCheck';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No sidebar on these - with auth check */}
        <Route path="/" element={
          <AuthCheck>
            <Login />
          </AuthCheck>
        } />
        <Route path="/register" element={
          <AuthCheck>
            <Register />
          </AuthCheck>
        } />

        {/* All these will show sidebar - with protection */}
        <Route element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Candidate-only */}
          <Route path="/jobs" element={
            <RoleBasedRoute allowedRoles={["candidate"]}>
              <FindJobs />
            </RoleBasedRoute>
          } />
          
          {/* Recruiter-only routes */}
          <Route path="/post-job" element={
            <RoleBasedRoute allowedRoles={['recruiter']}>
              <PostJob />
            </RoleBasedRoute>
          } />
          <Route path="/edit-job/:id" element={
            <RoleBasedRoute allowedRoles={['recruiter']}>
              <EditJob />
            </RoleBasedRoute>
          } />
          <Route path="/jobs-posted" element={
            <RoleBasedRoute allowedRoles={['recruiter']}>
              <JobsPosted />
            </RoleBasedRoute>
          } />
          <Route path="/applicants/:jobId" element={
            <RoleBasedRoute allowedRoles={['recruiter']}>
              <Applicants />
            </RoleBasedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
