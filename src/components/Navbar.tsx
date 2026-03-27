import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Home, LayoutDashboard, History, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-500 p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Flash Flow Tech</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center space-x-2">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Credits:</span>
              <span className="text-sm font-bold text-green-600">{user?.green_points || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
