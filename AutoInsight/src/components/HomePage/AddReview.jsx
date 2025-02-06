/* eslint-disable react/prop-types */
import  { useState } from "react";

const AddReview = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState(""); // Name is now input by the user
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    onSubmit({ name, rating, review });
    onClose(); // Close the modal after submitting the review
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add Review</h2>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Your Review"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
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
