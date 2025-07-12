import { useEffect, useState } from "react";
import api from "../services/api";


export default function SwapDashboard() {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await api.get("/swap");
      setRequests(res.data);
    } catch (err) {
      alert("Failed to load swap requests");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, action) => {
    try {
      await api.post("/swap/respond", { requestId, action });
      fetchRequests();
    } catch (err) {
      alert("Failed to update request");
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await api.delete(`/swap/${requestId}`);
      fetchRequests();
    } catch (err) {
      alert("Failed to delete request");
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
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Swap Dashboard</h2>
      
      {/* Received Requests */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Received Swap Requests</h3>
        {requests.received.length === 0 ? (
          <p className="text-gray-500">No received requests</p>
        ) : (
          <div className="space-y-4">
            {requests.received.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{r.fromUser.name}</p>
                    <p className="text-gray-600">wants to swap skills with you</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: <span className={`font-medium ${
                        r.status === 'PENDING' ? 'text-yellow-600' :
                        r.status === 'ACCEPTED' ? 'text-green-600' :
                        'text-red-600'
                      }`}>{r.status}</span>
                    </p>
                  </div>
                  {r.status === "ACCEPTED" && (
                    <button
                      onClick={() => setFeedbackTarget(r.fromUser.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
                {r.status === "PENDING" && (
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => handleRespond(r.id, "accept")} 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRespond(r.id, "reject")} 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Sent Swap Requests</h3>
        {requests.sent.length === 0 ? (
          <p className="text-gray-500">No sent requests</p>
        ) : (
          <div className="space-y-4">
            {requests.sent.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">You requested {r.toUser.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: <span className={`font-medium ${
                        r.status === 'PENDING' ? 'text-yellow-600' :
                        r.status === 'ACCEPTED' ? 'text-green-600' :
                        'text-red-600'
                      }`}>{r.status}</span>
                    </p>
                  </div>
                  {r.status === "ACCEPTED" && (
                    <button
                      onClick={() => setFeedbackTarget(r.toUser.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
                {r.status === "PENDING" && (
                  <button 
                    onClick={() => handleDelete(r.id)} 
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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
