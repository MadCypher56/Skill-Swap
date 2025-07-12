import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const availabilityOptions = ["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    profilePic: "",
    availability: [],
    isPublic: true,
    skillsOffered: [],
    skillsWanted: [],
  });

  const [newOfferedSkill, setNewOfferedSkill] = useState("");
  const [newWantedSkill, setNewWantedSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Profile component mounted");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");
      setLoading(true);
      setError(null);
      const res = await getUserProfile();
      console.log("Profile data:", res.data);
      
      // Handle different response structures
      let profileData = res.data;
      
      // If the response is nested, extract the actual data
      if (profileData && typeof profileData === 'object' && 'data' in profileData) {
        profileData = profileData.data;
      }
      
      // Ensure we have the expected structure
      const safeProfile = {
        name: profileData?.name || "",
        email: profileData?.email || "",
        location: profileData?.location || "",
        profilePic: profileData?.profilePic || "",
        availability: Array.isArray(profileData?.availability) ? profileData.availability : [],
        isPublic: profileData?.isPublic !== false, // default to true
        skillsOffered: Array.isArray(profileData?.skillsOffered) ? profileData.skillsOffered : [],
        skillsWanted: Array.isArray(profileData?.skillsWanted) ? profileData.skillsWanted : [],
      };
      
      console.log("Processed profile data:", safeProfile);
      setProfile(safeProfile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAvailability = (option) => {
    setProfile((prev) => {
      const avail = prev.availability.includes(option)
        ? prev.availability.filter((a) => a !== option)
        : [...prev.availability, option];
      return { ...prev, availability: avail };
    });
  };

  const toggleIsPublic = () => {
    setProfile((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const addSkill = (type) => {
    if (type === "offered" && newOfferedSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newOfferedSkill.trim()],
      }));
      setNewOfferedSkill("");
    } else if (type === "wanted" && newWantedSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newWantedSkill.trim()],
      }));
      setNewWantedSkill("");
    }
  };

  const removeSkill = (type, skill) => {
    if (type === "offered") {
      setProfile((prev) => ({
        ...prev,
        skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting profile data:', profile);
      
      // Ensure skills are in the correct format
      const submitData = {
        ...profile,
        skillsOffered: profile.skillsOffered.map(skill => 
          typeof skill === 'string' ? skill : skill.name || skill
        ),
        skillsWanted: profile.skillsWanted.map(skill => 
          typeof skill === 'string' ? skill : skill.name || skill
        )
      };
      
      console.log('Formatted submit data:', submitData);
      
      const response = await updateUserProfile(submitData);
      console.log('Update response:', response);
      
      alert("Profile updated successfully!");
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to update profile: ${err.response?.data?.message || err.message}`);
    }
  };

  console.log("Profile render - loading:", loading, "error:", error, "profile:", profile);

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{profile.name || 'Profile'}</h1>
              <p className="text-blue-100 mt-1">{profile.email || 'No email'}</p>
              {profile.location && (
                <p className="text-blue-100 mt-1">📍 {profile.location}</p>
              )}
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.isPublic ? 'Public Profile' : 'Private Profile'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  name="profilePic"
                  value={profile.profilePic || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleAvailability(option)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        profile.availability.includes(option)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={profile.isPublic}
                  onChange={toggleIsPublic}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make my profile public
                </label>
              </div>

              {/* Skills Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills I Can Teach</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOfferedSkill}
                        onChange={(e) => setNewOfferedSkill(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a skill"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill("offered")}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(profile.skillsOffered || []).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {typeof skill === 'string' ? skill : skill.name || 'Unknown Skill'}
                          <button
                            type="button"
                            onClick={() => removeSkill("offered", skill)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills I Want to Learn</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newWantedSkill}
                        onChange={(e) => setNewWantedSkill(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a skill"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill("wanted")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(profile.skillsWanted || []).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {typeof skill === 'string' ? skill : skill.name || 'Unknown Skill'}
                          <button
                            type="button"
                            onClick={() => removeSkill("wanted", skill)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills I Can Teach</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                      profile.skillsOffered.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {typeof skill === 'string' ? skill : skill.name || 'Unknown Skill'}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills offered yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills I Want to Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                      profile.skillsWanted.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {typeof skill === 'string' ? skill : skill.name || 'Unknown Skill'}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills wanted yet</p>
                    )}
                  </div>
                </div>
              </div>

              {profile.availability && profile.availability.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.availability.map((option) => (
                      <span
                        key={option}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 