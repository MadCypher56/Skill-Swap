import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Password synchronization failed. Please verify both entries.');
      return;
    }
    
    setLoading(true);
  
    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert('Registration successful! Your portal access has been created.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="cyber-grid absolute inset-0 opacity-20"></div>
      
      <div className="relative max-w-md w-full">
        <div className="glass rounded-2xl p-8 neon-purple">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
              Create Portal Access
            </h2>
            <p className="text-gray-300">Join the future of skill sharing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Create a secure password"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-500 hover:to-green-500 disabled:opacity-50 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105 neon-purple"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Access...</span>
                </div>
              ) : (
                'Initialize Portal'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have access?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Enter Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}