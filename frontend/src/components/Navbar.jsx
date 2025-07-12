import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">SkillSwap</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
            <Link to="/browse" className="hover:text-blue-500">Browse</Link>
            <Link to="/swap" className="hover:text-blue-500">Swap</Link>
            <Link to="/marketplace" className="hover:text-blue-500">Marketplace</Link>
            <Link to="/learning" className="hover:text-blue-500">Learning Hub</Link>
            <Link to="/private-learning" className="hover:text-blue-500">Private Learning</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold">Admin</Link>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
