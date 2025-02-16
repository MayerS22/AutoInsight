/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";

const AddReview = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState(""); // State for user's name
  const [userPhoto, setUserPhoto] = useState(null); // State for user's photo

  // Fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:3000/api/v1/users/user-data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.body.username); // Set user's name
        setUserPhoto(response.data.body.profile_picture); // Set user's photo
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  // Handle review submission
  const handleSubmit = async () => {
    if (!review) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please write your review!",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You need to be logged in to submit a review.",
      });
      return;
    }

    // Review data following API requirements
    const reviewData = {
      rating: rating, // Star rating
      description: review, // Review text (renamed from "review" to "description")
    };

    try {
      const response = await axios.post("http://localhost:3000/api/v1/reviews", reviewData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Review Added!",
          text: "Thank you for your feedback.",
          confirmButtonColor: "#6B46C1",
        });

        onSubmit(response.data.body); // Pass the newly created review object
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add Review</h2>

        {/* User Avatar and Name */}
        <div className="flex items-center gap-3 mb-4">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="User"
              className="w-16 h-16 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{userName}</p>
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
