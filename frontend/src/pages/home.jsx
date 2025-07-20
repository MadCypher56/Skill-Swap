import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Skill
              </span>
              <span className="text-white">Swap</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Enter the future of learning. Connect with minds across the digital realm, 
              exchange knowledge, and evolve your skills in our advanced peer-to-peer platform.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 neon-blue"
                >
                  Initialize Journey
                </Link>
                <Link 
                  to="/login" 
                  className="glass hover:neon-purple px-8 py-4 rounded-full text-purple-300 font-semibold text-lg transition-all hover:scale-105"
                >
                  Access Portal
                </Link>
              </div>
            ) : (
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 neon-green"
              >
                Enter Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Advanced Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="🔗"
            title="Neural Networking"
            description="Connect with like-minded individuals through our advanced matching algorithms"
            color="blue"
          />
          <FeatureCard
            icon="⚡"
            title="Instant Exchange"
            description="Real-time skill swapping with seamless communication protocols"
            color="purple"
          />
          <FeatureCard
            icon="🎯"
            title="Precision Learning"
            description="Targeted skill acquisition through personalized learning pathways"
            color="green"
          />
          <FeatureCard
            icon="🌐"
            title="Global Network"
            description="Access a worldwide community of knowledge sharers and learners"
            color="pink"
          />
          <FeatureCard
            icon="🔒"
            title="Secure Platform"
            description="Enterprise-grade security protecting your learning journey"
            color="blue"
          />
          <FeatureCard
            icon="📊"
            title="Progress Analytics"
            description="Advanced metrics tracking your skill development evolution"
            color="purple"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass mx-6 rounded-2xl p-12 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatItem number="10K+" label="Active Users" />
            <StatItem number="50K+" label="Skills Exchanged" />
            <StatItem number="25K+" label="Learning Sessions" />
            <StatItem number="98%" label="Satisfaction Rate" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    blue: 'neon-blue',
    purple: 'neon-purple',
    green: 'neon-green',
    pink: 'neon-pink'
  };

  return (
    <div className={`glass rounded-xl p-6 card-hover ${colorClasses[color]}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-gray-300 font-medium">{label}</div>
    </div>
  );
}