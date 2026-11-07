// components/SidebarLayout.js
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
