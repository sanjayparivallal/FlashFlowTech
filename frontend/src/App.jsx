import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

// Shows a spinner while restoring auth from localStorage
function AppLoader({ children }) {
  const { loading } = useUser()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return children
}

// Redirects unauthenticated users to /signin
function PrivateRoute({ element }) {
  const { isAuthenticated } = useUser()
  return isAuthenticated ? element : <Navigate to="/signin" replace />
}

// Redirects already-logged-in users away from auth pages
function PublicRoute({ element }) {
  const { isAuthenticated } = useUser()
  return isAuthenticated ? <Navigate to="/home" replace /> : element
}

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home"      element={<PrivateRoute element={<Home />} />} />
        <Route path="/results"   element={<PrivateRoute element={<Results />} />} />
        <Route path="/history"   element={<PrivateRoute element={<History />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/profile"   element={<PrivateRoute element={<Profile />} />} />
        <Route path="/signin"    element={<PublicRoute element={<Signin />} />} />
        <Route path="/signup"    element={<PublicRoute element={<Signup />} />} />
        <Route path="*"          element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppLoader>
          <Layout />
        </AppLoader>
      </BrowserRouter>
    </UserProvider>
  )
}
