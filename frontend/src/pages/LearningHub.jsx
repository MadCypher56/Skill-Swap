import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function LearningHub() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    skillName: '',
    sessionType: 'LIVE',
    maxParticipants: 10,
    scheduledDate: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/learning/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load learning sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/learning/sessions', newSession);
      alert('Learning session created successfully!');
      setNewSession({
        title: '',
        description: '',
        skillName: '',
        sessionType: 'LIVE',
        maxParticipants: 10,
        scheduledDate: ''
      });
      setShowCreateForm(false);
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create session');
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      await api.post(`/learning/sessions/${sessionId}/join`);
      alert('Joined session successfully!');
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join session');
    }
  };

  const handleLeaveSession = async (sessionId) => {
    try {
      await api.delete(`/learning/sessions/${sessionId}/leave`);
      alert('Left session successfully!');
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/learning/sessions/${sessionId}`);
        alert('Session deleted successfully!');
        fetchSessions();
      } catch (err) {
        alert('Failed to delete session');
      }
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'LIVE': return 'bg-red-100 text-red-800';
      case 'RECORDED': return 'bg-blue-100 text-blue-800';
      case 'WORKSHOP': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = activeTab === 'all' ? sessions : 
    activeTab === 'my-sessions' ? sessions.filter(s => s.host.id === user?.id) :
    sessions.filter(s => s.sessionType === activeTab);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Learning Hub</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {showCreateForm ? 'Cancel' : 'Create Session'}
        </button>
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Learning Session</h2>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript Fundamentals Workshop"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSession.skillName}
                  onChange={(e) => setNewSession({...newSession, skillName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, Python, Guitar"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newSession.description}
                onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe what will be covered in this session..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <select
                  value={newSession.sessionType}
                  onChange={(e) => setNewSession({...newSession, sessionType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LIVE">Live Session</option>
                  <option value="RECORDED">Recorded Content</option>
                  <option value="WORKSHOP">Interactive Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  value={newSession.maxParticipants}
                  onChange={(e) => setNewSession({...newSession, maxParticipants: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={newSession.scheduledDate}
                  onChange={(e) => setNewSession({...newSession, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setActiveTab('my-sessions')}
          className={`px-4 py-2 ${activeTab === 'my-sessions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          My Sessions
        </button>
        <button
          onClick={() => setActiveTab('LIVE')}
          className={`px-4 py-2 ${activeTab === 'LIVE' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Live Sessions
        </button>
        <button
          onClick={() => setActiveTab('WORKSHOP')}
          className={`px-4 py-2 ${activeTab === 'WORKSHOP' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Workshops
        </button>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-center py-8">Loading sessions...</div>
      ) : (
        <div className="grid gap-6">
          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sessions found.</p>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSessionTypeColor(session.sessionType)}`}>
                        {session.sessionType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
                    <p className="text-gray-600 mb-2">{session.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Skill: {session.skillName}</span>
                      <span>Host: {session.host.name}</span>
                      <span>Participants: {session.participants.length}/{session.maxParticipants}</span>
                      {session.scheduledDate && (
                        <span>Scheduled: {new Date(session.scheduledDate).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {session.host.id === user?.id ? (
                      <>
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      session.participants.some(p => p.user.id === user?.id) ? (
                        <button
                          onClick={() => handleLeaveSession(session.id)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          disabled={session.participants.length >= session.maxParticipants}
                        >
                          {session.participants.length >= session.maxParticipants ? 'Full' : 'Join'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedSession.title}</h2>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <SessionDetail session={selectedSession} onClose={() => setSelectedSession(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Session Detail Component
function SessionDetail({ session, onClose }) {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resourceType: 'CODE',
    content: '',
    fileUrl: ''
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [session.id]);

  const fetchResources = async () => {
    try {
      const res = await api.get(`/learning/sessions/${session.id}/resources`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/learning/sessions/${session.id}/resources`, newResource);
      alert('Resource uploaded successfully!');
      setNewResource({
        title: '',
        description: '',
        resourceType: 'CODE',
        content: '',
        fileUrl: ''
      });
      setShowUploadForm(false);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload resource');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/learning/resources/${resourceId}`);
        alert('Resource deleted successfully!');
        fetchResources();
      } catch (err) {
        alert('Failed to delete resource');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Session Information</h3>
        <p className="text-gray-600 mb-2">{session.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Skill:</span> {session.skillName}
          </div>
          <div>
            <span className="font-medium">Type:</span> {session.sessionType}
          </div>
          <div>
            <span className="font-medium">Status:</span> {session.status}
          </div>
          <div>
            <span className="font-medium">Participants:</span> {session.participants.length}/{session.maxParticipants}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Resources</h3>
          {session.host.id === user?.id && (
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              {showUploadForm ? 'Cancel' : 'Upload Resource'}
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-3">Upload Resource</h4>
            <form onSubmit={handleUploadResource} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newResource.resourceType}
                    onChange={(e) => setNewResource({...newResource, resourceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CODE">Code Snippet</option>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENT">Document</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {newResource.resourceType === 'CODE' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code Content</label>
                  <textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    placeholder="Paste your code here..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                  <input
                    type="url"
                    value={newResource.fileUrl}
                    onChange={(e) => setNewResource({...newResource, fileUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/file"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resources List */}
        <div className="space-y-3">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No resources uploaded yet.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{resource.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.resourceType === 'CODE' ? 'bg-green-100 text-green-800' :
                        resource.resourceType === 'VIDEO' ? 'bg-red-100 text-red-800' :
                        resource.resourceType === 'IMAGE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.resourceType}
                      </span>
                    </div>
                    {resource.description && (
                      <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                    )}
                    {resource.resourceType === 'CODE' && resource.content && (
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        <code>{resource.content}</code>
                      </pre>
                    )}
                    {resource.fileUrl && resource.resourceType !== 'CODE' && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Resource
                      </a>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded by {resource.uploadedByUser.name} on {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {resource.uploadedBy === user?.id && (
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-800 text-sm ml-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 