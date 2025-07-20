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
      <div className="max-w-7xl mx-auto p-6">
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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="glass rounded-2xl p-8 hologram">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-4">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to explore the future of skill sharing? Your learning journey continues here.
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Sent Requests"
          value={stats.sentRequests}
          icon="📤"
          color="blue"
          description="Outgoing skill requests"
        />
        <StatCard
          title="Received Requests"
          value={stats.receivedRequests}
          icon="📥"
          color="green"
          description="Incoming opportunities"
        />
        <StatCard
          title="Completed Swaps"
          value={stats.completedSwaps}
          icon="✨"
          color="purple"
          description="Successful exchanges"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          to="/browse"
          title="Browse Users"
          description="Discover skill partners"
          icon="🔍"
          color="blue"
        />
        <ActionCard
          to="/marketplace"
          title="Skill Marketplace"
          description="Post & find skills"
          icon="💼"
          color="green"
        />
        <ActionCard
          to="/swap"
          title="Swap Dashboard"
          description="Manage exchanges"
          icon="🔄"
          color="purple"
        />
        <ActionCard
          to="/learning"
          title="Learning Hub"
          description="Join sessions"
          icon="📚"
          color="pink"
        />
      </div>

      {/* Skills Overview */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="text-3xl mr-3">🎯</span>
          Your Skill Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkillSection
            title="Skills You Offer"
            skills={user.skillsOffered}
            color="green"
            emptyMessage="No skills offered yet"
          />
          <SkillSection
            title="Skills You Want"
            skills={user.skillsWanted}
            color="blue"
            emptyMessage="No skills wanted yet"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, description }) {
  const colorClasses = {
    blue: 'neon-blue',
    green: 'neon-green',
    purple: 'neon-purple',
    pink: 'neon-pink'
  };

  return (
    <div className={`glass rounded-xl p-6 card-hover ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{value}</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function ActionCard({ to, title, description, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
    green: 'from-green-600 to-green-700 hover:from-green-500 hover:to-green-600',
    purple: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
    pink: 'from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600'
  };

  return (
    <Link 
      to={to} 
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl text-center hover:scale-105 transition-all duration-300 group`}
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-semibold text-white mb-2">{title}</div>
      <div className="text-sm text-gray-200 opacity-90">{description}</div>
    </Link>
  );
}

function SkillSection({ title, skills, color, emptyMessage }) {
  const colorClasses = {
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };

  return (
    <div>
      <h3 className="font-semibold text-white mb-4 text-lg">{title}</h3>
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${colorClasses[color]} backdrop-blur-sm`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">{emptyMessage}</p>
      )}
    </div>
  );
}