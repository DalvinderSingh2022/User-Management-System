import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaSave,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { user, updateProfile, loading, getProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    if (!formData) {
      (async () => {
        if (userId === user._id) {
          setFormData(user);
        } else {
          const profile = await getProfile(userId);
          setFormData(profile);
        }
      })();
    }

    return () => setFormData(null);
  }, [user, userId, getProfile]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvailabilityChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== user[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    await updateProfile(updateData);
    setIsEditing(false);
  };

  if (!formData) {
    return <div>loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex item-center justify-start">
              {formData.isAdmin && (
                <span className="py-1 px-2 self-center mr-2 -ml-2 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Admin
                </span>
              )}
              <input
                disabled={!isEditing}
                type="text"
                name="name"
                value={formData.name || (isEditing ? "" : "Not provided")}
                onChange={handleChange}
                className={
                  isEditing
                    ? "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "text-3xl font-bold text-gray-800 flex items-center"
                }
                placeholder="Enter mobile number"
              />
            </div>
            {user._id === userId && (
              <button
                onClick={isEditing ? handleSubmit : handleEditToggle}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? (
                  <FaSave className="mr-2" />
                ) : (
                  <FaEdit className="mr-2" />
                )}
                {isEditing
                  ? loading
                    ? "Saving..."
                    : "Save Changes"
                  : "Edit Profile"}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaEnvelope className="mr-2" />
                Email
              </h3>
              <span className="text-gray-700">{formData.email}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaPhone className="mr-2" />
                Mobile Number
              </h3>
              <input
                disabled={!isEditing}
                type="tel"
                name="mobileNumber"
                value={
                  formData.mobileNumber || (isEditing ? "" : "Not provided")
                }
                onChange={handleChange}
                className={
                  isEditing
                    ? "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "text-gray-700"
                }
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaClock className="mr-2" />
                Availability
              </h3>
              <div className="flex items-center mb-2">
                <input
                  disabled={!isEditing}
                  type="time"
                  value={formData.availability.start}
                  onChange={(e) =>
                    handleAvailabilityChange("start", e.target.value)
                  }
                  className={
                    isEditing
                      ? "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      : "text-gray-700"
                  }
                />
                <span className="mx-2">to</span>
                <input
                  disabled={!isEditing}
                  type="time"
                  value={formData.availability.end}
                  onChange={(e) =>
                    handleAvailabilityChange("end", e.target.value)
                  }
                  className={
                    isEditing
                      ? "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      : "text-gray-700"
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaUser className="mr-2" />
                Bio
              </h3>

              <textarea
                disabled={!isEditing}
                name="bio"
                value={formData.bio || (isEditing ? "" : "No bio available")}
                onChange={handleChange}
                className={
                  isEditing
                    ? "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "text-gray-700 resize-none"
                }
                rows="4"
                placeholder="Write your bio..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
