import React from 'react';
import { GraduationCap, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <GraduationCap className="h-8 w-8 text-primary-400" />
            <span className="ml-2 text-xl font-bold">College Connect</span>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
                <li><a href="#events" className="hover:text-primary-400 transition-colors">All Events</a></li>
                <li><a href="/login" className="hover:text-primary-400 transition-colors">Admin Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#cultural" className="hover:text-primary-400 transition-colors">Cultural</a></li>
                <li><a href="#sports" className="hover:text-primary-400 transition-colors">Sports</a></li>
                <li><a href="#technical" className="hover:text-primary-400 transition-colors">Technical</a></li>
                <li><a href="#academic" className="hover:text-primary-400 transition-colors">Academic</a></li>
                <li><a href="#social" className="hover:text-primary-400 transition-colors">Social</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary-400" />
                  <a href="mailto:collegeconnect36@gmail.com" className="hover:text-primary-400 transition-colors">
                  collegeconnect36@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary-400" />
                  <span>+91 9439876541</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} College Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;