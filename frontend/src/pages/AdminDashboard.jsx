import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [skillPosts, setSkillPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/analytics')
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load dashboard stats');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/swap-requests');
      setSwapRequests(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/feedback');
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/skill-posts');
      setSkillPosts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load skill posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkillPost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this skill post?')) {
      try {
        await api.delete(`/admin/skill-posts/${postId}`);
        alert('Skill post deleted successfully');
        fetchSkillPosts();
      } catch (err) {
        alert('Failed to delete skill post');
      }
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/announcements', announcement);
      alert('Announcement sent successfully!');
      setAnnouncement({ title: '', message: '', type: 'info' });
    } catch (err) {
      alert('Failed to send announcement');
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await api.put(`/admin/users/${userId}/ban`, { isBanned });
      alert(`User ${isBanned ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) fetchUsers();
    if (tab === 'swaps' && swapRequests.length === 0) fetchSwapRequests();
    if (tab === 'feedback' && feedback.length === 0) fetchFeedback();
    if (tab === 'skill-posts' && skillPosts.length === 0) fetchSkillPosts();
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleTabChange('users')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Users
        </button>
        <button
          onClick={() => handleTabChange('swaps')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'swaps' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Swap Requests
        </button>
        <button
          onClick={() => handleTabChange('feedback')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'feedback' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Feedback
        </button>
        <button
          onClick={() => handleTabChange('skill-posts')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'skill-posts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Skill Posts
        </button>
        <button
          onClick={() => handleTabChange('announcements')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'announcements' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Announcements
        </button>
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.activeUsers || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.completionRate || 0}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Avg Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.averageRating || 0}/5</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Banned Users</h3>
              <p className="text-3xl font-bold text-red-600">{stats.bannedUsers || 0}</p>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
              {analytics.topSkills && analytics.topSkills.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topSkills.slice(0, 5).map((skill, index) => (
                    <div key={skill.skillName} className="flex justify-between items-center">
                      <span className="font-medium">{skill.skillName}</span>
                      <span className="text-blue-600 font-bold">{skill._count.skillName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skill data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {analytics.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <span className="font-medium">{activity.fromUser.name}</span>
                      <span className="text-gray-500"> → </span>
                      <span className="font-medium">{activity.toUser.name}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleBanUser(user.id, !user.isBanned)}
                            className={`px-3 py-1 text-xs rounded ${user.isBanned ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Swap Requests */}
      {activeTab === 'swaps' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Swap Requests</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {swapRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{request.fromUser.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.toUser.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">User Feedback</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedback.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{item.fromUser.name}</span>
                      <span className="text-gray-500"> → </span>
                      <span className="font-medium">{item.toUser.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{item.rating}/5</span>
                    </div>
                  </div>
                  {item.comment && (
                    <p className="text-gray-600 mt-2">{item.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skill Posts Management */}
      {activeTab === 'skill-posts' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Skill Posts Management</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {skillPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium">{post.user.name}</p>
                          <p className="text-sm text-gray-500">{post.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">{post.skillName}</span>
                        {post.description && (
                          <p className="text-sm text-gray-500 mt-1">{post.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.postType === 'OFFERING' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.postType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteSkillPost(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Announcements */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Send Platform Announcement</h2>
          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={announcement.message}
                onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Announcement message"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={announcement.type}
                onChange={(e) => setAnnouncement({...announcement, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Announcement
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 