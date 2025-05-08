import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogIn, LogOut, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">College Connect</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
                <Link 
                  to="/admin/create-event" 
                  className="inline-flex items-center text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </Link>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;