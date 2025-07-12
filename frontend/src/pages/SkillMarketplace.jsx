import { useState, useEffect } from "react";
import { getSkillPosts } from "../services/api";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";

export default function SkillMarketplace() {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    skillName: '',
    description: '',
    postType: 'OFFERING'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      console.log('Fetching skill posts data...');
      
      // Fetch all data in parallel
      const [postsRes, myPostsRes, recommendationsRes] = await Promise.all([
        getSkillPosts(),
        api.get('/skill-posts/my-posts'),
        api.get('/skill-posts/recommendations')
      ]);
      
      console.log('Posts response:', postsRes);
      console.log('My posts response:', myPostsRes);
      console.log('Recommendations response:', recommendationsRes);
      
      setPosts(postsRes.data);
      setMyPosts(myPostsRes.data);
      setRecommendations(recommendationsRes.data);
    } catch (err) {
      console.error('Failed to load skill posts:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load skill posts. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getSkillPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      alert('Failed to load skill posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await api.get('/skill-posts/my-posts');
      setMyPosts(res.data);
    } catch (err) {
      console.error('Failed to load my posts:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/skill-posts/recommendations');
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating skill post:', newPost);
      await api.post('/skill-posts', newPost);
      alert('Skill post created successfully!');
      setNewPost({ skillName: '', description: '', postType: 'OFFERING' });
      // Refresh all data
      await fetchInitialData();
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/skill-posts/${postId}`);
        alert('Post deleted successfully!');
        // Refresh relevant data
        await Promise.all([fetchMyPosts(), fetchRecommendations()]);
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const filteredPosts = activeTab === 'all' ? posts : posts.filter(post => post.postType === activeTab);

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Skill Marketplace</h1>
        <SkeletonLoader type="card" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Skill Marketplace</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchInitialData}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Skill Marketplace</h1>
      
      {/* Create New Post */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Post Your Skill</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                value={newPost.skillName}
                onChange={(e) => setNewPost({...newPost, skillName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
              <select
                value={newPost.postType}
                onChange={(e) => setNewPost({...newPost, postType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="OFFERING">I'm Offering</option>
                <option value="SEEKING">I'm Seeking</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe your skill or what you're looking for..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveTab('OFFERING')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'OFFERING' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Offering
        </button>
        <button
          onClick={() => setActiveTab('SEEKING')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'SEEKING' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Seeking
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recommendations' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Recommendations
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : (
        <div>
          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {recommendations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No matches found. Create some skill posts to see recommendations!</p>
              ) : (
                recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      You {rec.mySkill.postType === 'OFFERING' ? 'offer' : 'want'} <span className="text-blue-600">{rec.mySkill.skillName}</span>
                    </h3>
                    <div className="space-y-4">
                      {rec.matches.map((match, matchIndex) => (
                        <div key={matchIndex} className="border-l-4 border-green-500 pl-4">
                          <p className="font-medium">{match.user.name} {match.postType === 'OFFERING' ? 'offers' : 'wants'} {match.skillName}</p>
                          {match.description && (
                            <p className="text-gray-600 text-sm mt-1">{match.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* All Posts Tab */}
          {activeTab !== 'recommendations' && (
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No posts found.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            post.postType === 'OFFERING' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {post.postType === 'OFFERING' ? 'Offering' : 'Seeking'}
                          </span>
                          <h3 className="text-lg font-semibold">{post.skillName}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{post.user.name}</p>
                        {post.description && (
                          <p className="text-gray-700 mb-3">{post.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Posted {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {post.user.id === localStorage.getItem('userId') && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 