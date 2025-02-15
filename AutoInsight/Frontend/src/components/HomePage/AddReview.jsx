/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

const AddReview = ({ isOpen, onClose, onSubmit, userImage }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const getInitials = (fullName) => {
    if (!fullName) return "U"; 
    const words = fullName.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return `${words[0][0]}${words[1]?.[0] || ""}`.toUpperCase();
  };

  const handleSubmit = () => {
    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter your name!",
      });
      return;
    }

    onSubmit({ name, rating, review });

    // Show success alert
    Swal.fire({
      icon: "success",
      title: "Review Added!",
      text: "Thank you for your feedback.",
      confirmButtonColor: "#6B46C1", // Matches your purple theme
    });

    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add Review</h2>

        {/* User Avatar */}
        <div className="flex items-center gap-3 mb-4">
          {userImage ? (
            <img
              src={userImage}
              alt="User"
              className="w-16 h-16 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
              {getInitials(name)}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-4 flex items-center">
          <label className="text-sm font-semibold mr-3">Rating:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                size={24}
                className={`cursor-pointer transition-colors ${
                  value <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(value)}
              />
            ))}
          </div>
        </div>

        {/* Review Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-purple-900 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
