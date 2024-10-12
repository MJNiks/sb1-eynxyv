import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useClinicContext } from '../context/ClinicContext';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicInfo } = useClinicContext();

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Patient Reviews', path: '/reviews' },
    { icon: MessageSquare, label: 'Niks AI', path: '/niks-ai', highlight: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg flex flex-col"
      >
        <div className="p-4 flex items-center justify-center">
          <img src={clinicInfo.logo} alt="Clinic Logo" className="h-12 w-12 rounded-full" />
        </div>
        <nav className="flex-grow mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
              } ${item.highlight ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : ''}`}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <LogOut className="mr-2" size={18} />
            Log Out
          </button>
        </div>
      </motion.aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;