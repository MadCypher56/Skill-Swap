import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSwapRequests, getUserProfile } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    sentRequests: 0,
    receivedRequests: 0,
    completedSwaps: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Use Promise.all to fetch data in parallel
      const [profileRes, swapRes] = await Promise.all([
        getUserProfile(),
        getSwapRequests()
      ]);
      
      setUser(profileRes.data);
      const { sent, received } = swapRes.data;
      
      setStats({
        sentRequests: sent.length,
        receivedRequests: received.length,
        completedSwaps: [...sent, ...received].filter(r => r.status === 'ACCEPTED').length
      });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <SkeletonLoader type="stats" count={3} />
        </div>
        <div className="mb-8">
          <SkeletonLoader type="card" count={2} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}! 👋</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Sent Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.sentRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Received Requests</h3>
          <p className="text-3xl font-bold text-green-600">{stats.receivedRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Completed Swaps</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.completedSwaps}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/browse" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
          <div className="text-2xl mb-2">🔍</div>
          <div className="font-semibold">Browse Users</div>
        </Link>
        <Link to="/marketplace" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
          <div className="text-2xl mb-2">💼</div>
          <div className="font-semibold">Skill Marketplace</div>
        </Link>
        <Link to="/swap" className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
          <div className="text-2xl mb-2">🔄</div>
          <div className="font-semibold">Swap Dashboard</div>
        </Link>
        <Link to="/learning" className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors">
          <div className="text-2xl mb-2">📚</div>
          <div className="font-semibold">Learning Hub</div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-2">Skills You Offer</h3>
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills offered yet</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Skills You Want</h3>
            {user.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills wanted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 