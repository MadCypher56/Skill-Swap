import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="glass border-b border-white/10 px-6 py-4 sticky top-0 z-50 backdrop-blur-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
          ⚡ SkillSwap
        </Link>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/dashboard" icon="🏠">Dashboard</NavLink>
                <NavLink to="/profile" icon="👤">Profile</NavLink>
                <NavLink to="/browse" icon="🔍">Browse</NavLink>
                <NavLink to="/swap" icon="🔄">Swap</NavLink>
                <NavLink to="/marketplace" icon="💼">Marketplace</NavLink>
                <NavLink to="/learning" icon="📚">Learning Hub</NavLink>
                <NavLink to="/private-learning" icon="🎯">Private Learning</NavLink>
                {user.role === 'ADMIN' && (
                  <NavLink to="/admin" icon="⚙️" className="text-red-400 hover:text-red-300">Admin</NavLink>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="glass px-4 py-2 rounded-full">
                  <span className="text-sm text-blue-300">Welcome, {user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="glass hover:neon-blue px-4 py-2 rounded-full text-sm font-medium text-red-300 hover:text-red-200 transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="glass hover:neon-blue px-6 py-2 rounded-full text-blue-300 hover:text-blue-200 transition-all">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-full text-white font-medium transition-all hover:scale-105">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, children, icon, className = "" }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-2 text-gray-300 hover:text-white transition-all hover:scale-105 ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}