import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API_URL =process.env.REACT_APP_API_URL;


const Profile = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("You need to be logged in to view the profile.");
          navigate("/login");
          return;
        }

        // Fetch user profile data from backend
        const response = await axios.get(`${API_URL}api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set profile data from response
        setProfile(response.data);
        setNewUsername(response.data.username);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Error fetching profile details.");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You need to be logged in to update your profile.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProfile((prev) => ({ ...prev, username: newUsername }));
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          toast.error("You can only update your username once a year.");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized access. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Error updating profile.");
        }
      } else {
        toast.error("Error updating profile.");
      }
    }
  };

  return (
    <div className="profile-container bg-stone-900 text-white p-6 rounded-lg shadow-md max-w-4xl w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <label className="block text-gray-400">Email:</label>
        <p className="text-gray-200">{profile.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-400">Username:</label>
        {isEditing ? (
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full bg-gray-800 text-gray-200 p-2 rounded-md"
          />
        ) : (
          <p className="text-gray-200">{profile.username}</p>
        )}
      </div>
      <div className="flex justify-end gap-4">
        {isEditing ? (
          <button
            onClick={handleUpdate}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
