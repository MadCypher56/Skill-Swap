import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function PrivateLearning() {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState([]);
  const [privateSessions, setPrivateSessions] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSwapRequest, setSelectedSwapRequest] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    skillName: '',
    sessionType: 'LIVE',
    maxParticipants: 2,
    scheduledDate: ''
  });

  useEffect(() => {
    fetchSwapRequests();
    fetchPrivateSessions();
    fetchCertifications();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      const res = await api.get('/swap/requests');
      setSwapRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrivateSessions = async () => {
    try {
      const res = await api.get('/learning/sessions?privateOnly=true');
      setPrivateSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCertifications = async () => {
    try {
      const res = await api.get('/certifications/user');
      setCertifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePrivateSession = async (e) => {
    e.preventDefault();
    if (!selectedSwapRequest) {
      alert('Please select a swap request first');
      return;
    }

    try {
      await api.post('/learning/sessions', {
        ...newSession,
        isPrivate: true,
        swapRequestId: selectedSwapRequest.id
      });
      alert('Private learning session created successfully!');
      setNewSession({
        title: '',
        description: '',
        skillName: '',
        sessionType: 'LIVE',
        maxParticipants: 2,
        scheduledDate: ''
      });
      setShowCreateForm(false);
      setSelectedSwapRequest(null);
      fetchPrivateSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create private session');
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await api.put(`/learning/sessions/${sessionId}`, {
        status: 'COMPLETED'
      });
      alert('Session marked as completed! You can now create certifications.');
      fetchPrivateSessions();
    } catch (err) {
      alert('Failed to complete session');
    }
  };

  const handleCreateCertification = async (sessionId, swapRequestId, endorsedFor, skillName) => {
    const endorsementText = prompt('Enter your endorsement text:');
    const rating = prompt('Enter rating (1-5):', '5');

    if (!endorsementText || !rating) return;

    try {
      await api.post('/certifications', {
        sessionId,
        swapRequestId,
        endorsedFor,
        skillName,
        endorsementText,
        rating: parseInt(rating)
      });
      alert('Certification created successfully!');
      fetchCertifications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create certification');
    }
  };

  const getSwapPartner = (swapRequest) => {
    return swapRequest.fromUser.id === user?.id ? swapRequest.toUser : swapRequest.fromUser;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Private Learning Sessions</h1>

      {/* Create Private Session */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Private Learning Session</h2>
        
        {/* Swap Request Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Swap Request</label>
          <select
            value={selectedSwapRequest?.id || ''}
            onChange={(e) => {
              const selected = swapRequests.find(sr => sr.id === e.target.value);
              setSelectedSwapRequest(selected);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a swap request...</option>
            {swapRequests
              .filter(sr => sr.status === 'ACCEPTED')
              .map(sr => (
                <option key={sr.id} value={sr.id}>
                  {sr.fromUser.name} ↔ {sr.toUser.name} - {sr.fromUser.skillsOffered?.[0]?.name || 'Skill'} for {sr.toUser.skillsWanted?.[0]?.name || 'Skill'}
                </option>
              ))}
          </select>
        </div>

        {selectedSwapRequest && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Swap Details:</h3>
            <p><strong>From:</strong> {selectedSwapRequest.fromUser.name}</p>
            <p><strong>To:</strong> {selectedSwapRequest.toUser.name}</p>
            <p><strong>Status:</strong> {selectedSwapRequest.status}</p>
          </div>
        )}

        {selectedSwapRequest && (
          <form onSubmit={handleCreatePrivateSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript Fundamentals with John"
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
                placeholder="Describe what will be covered in this private session..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedSwapRequest(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Private Session
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Private Sessions List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Private Sessions</h2>
        <div className="grid gap-4">
          {privateSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No private sessions found.</p>
          ) : (
            privateSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        PRIVATE
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        session.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
                    <p className="text-gray-600 mb-2">{session.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Skill: {session.skillName}</span>
                      <span>Host: {session.host.name}</span>
                      {session.swapRequest && (
                        <span>Partner: {getSwapPartner(session.swapRequest).name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {session.status === 'SCHEDULED' && session.host.id === user?.id && (
                      <button
                        onClick={() => handleCompleteSession(session.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                    {session.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleCreateCertification(
                          session.id,
                          session.swapRequest?.id,
                          getSwapPartner(session.swapRequest).id,
                          session.skillName
                        )}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                      >
                        Create Certification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Certifications</h2>
        <div className="grid gap-4">
          {certifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No certifications found.</p>
          ) : (
            certifications.map((cert) => (
              <div key={cert.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        CERTIFIED
                      </span>
                      <span className="text-sm text-gray-500">
                        {cert.endorsedUser.name} → {cert.endorsedForUser.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{cert.skillName}</h3>
                    {cert.endorsementText && (
                      <p className="text-gray-600 mb-2">"{cert.endorsementText}"</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Rating: {cert.rating}/5 ⭐</span>
                      <span>Session: {cert.session.title}</span>
                      <span>Date: {new Date(cert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 