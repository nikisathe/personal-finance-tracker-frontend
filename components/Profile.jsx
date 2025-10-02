import { useState } from "react";
import axios from "axios";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Profile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(user?.full_name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formImage, setFormImage] = useState(null);

  const firstName = formName ? formName.split(" ")[0] : "User";

const handleSave = async () => {
  try {
    const response = await axios.put(
      `https://finance-tracker-backend-fdrs.onrender.com/api/auth/update/${user.id}`,
      {
        fullName: formName,
        email: formEmail,
      } // send as JSON
    );

    onUpdateUser(response.data.user);
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("Error updating profile. Please try again.");
  }
};


  return (
    <div className="p-6 text-center border-b relative">
      {/* Avatar Section */}
      <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3 relative overflow-hidden">
        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-200 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {firstName.charAt(0)}
            </span>
          </div>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full text-white shadow hover:bg-blue-700"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      {/* User Name + Email */}
      <h3 className="font-semibold text-gray-800">Hello, {firstName}!</h3>
      <p className="text-xs text-gray-500 truncate">{user?.email}</p>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <div className="mb-3 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-3 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormImage(e.target.files[0])}
                className="w-full text-sm"
              />
            </div> */}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
