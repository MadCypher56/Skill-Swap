import { useEffect, useState } from "react";
import api from "../services/api";

export default function Browse() {
  const [users, setUsers] = useState([]);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (search = "") => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const res = await api.get("/user/public-users", { params });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleRequestSwap = async (toUserId) => {
    try {
      await api.post("/swap/request", { toUserId });
      alert("Swap request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await api.post("/feedback", {
        toUserId: feedbackTarget,
        rating,
        comment,
      });
      alert("Feedback submitted!");
      setFeedbackTarget(null);
      setRating(5);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <div className="w-full mt-8 p-6">
      <h2 className="text-2xl font-semibold mb-6">Browse Skill Swappers</h2>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or skills..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center gap-4">
              {user.profilePic ? (
                <img src={user.profilePic} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              )}
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.location}</p>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p><strong>Availability:</strong> {user.availability.join(", ")}</p>
              <p><strong>Offers:</strong> {user.skillsOffered.map(s => s.name).join(", ")}</p>
              <p><strong>Wants:</strong> {user.skillsWanted.map(s => s.name).join(", ")}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleRequestSwap(user.id)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Request Swap
              </button>
              <button
                onClick={() => setFeedbackTarget(user.id)}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Give Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {feedbackTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Give Feedback</h3>
            <label className="block mb-1">Rating (1–5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 mb-3"
            />
            <label className="block mb-1">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFeedbackSubmit}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setFeedbackTarget(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
