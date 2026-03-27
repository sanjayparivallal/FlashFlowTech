import { NavLink, useNavigate } from 'react-router-dom'
import { Leaf, LogOut } from 'lucide-react'
import { useUser } from '../context/UserContext'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/signin')
  }

  // Don't render navbar on public pages (it's handled by those pages)
  if (!isAuthenticated) return null

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/home" className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Flash<span className="text-green-500">Flow</span> Tech
            </span>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-green-600 bg-green-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Badge + Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <Leaf className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-semibold text-green-700">{user?.green_points ?? 0} pts</span>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
