/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import AddReview from "./AddReview";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";

const Reviews = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([{
    rating: 5,
    content: "The restaurant was fantastic, and the ambiance was lovely.",
    username: "John Doe",
  }]);
  const [username, setUserName] = useState("");
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);


  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setUserName(response.data);
      setUserName(response.data.body.username);
    } catch (error) {
      console.log("Error fetching user:", error.message);

    }
  };
  // Call fetchUserProfile inside useEffect when the component mounts or user logs in
  useEffect(() => {
    fetchUserProfile();
  }, [isLoggedIn]);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found, user is not authenticated");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/v1/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviewsData = response.data.body;
      setReviews(reviewsData);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error.message);
    }
  };


  const handleAddReview = () => {
    if (isLoggedIn) {
      setIsModalOpen(true);
    } else {
      Swal.fire({
        title: "You are not logged in!",
        text: "Redirecting to login page...",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    }
  };

  const handleReviewSubmit = async (newReview) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userResponse = await axios.get("http://localhost:3000/api/v1/users/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data.body;
      const reviewWithUser = {
        ...newReview,
        user: { username: user.username, profile_picture: user.profile_picture },
      };

      setReviews((prevReviews) => [reviewWithUser, ...prevReviews]);
      fetchReviews();
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-14">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-purple-900">What Our Customers Say</h2>
          <p className="text-lg text-purple-700 mt-2">We Want To Hear From You Too</p>
        </div>
        <button
          onClick={handleAddReview}
          className="bg-purple-900 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Add Review
        </button>
      </div>

      <div className="flex items-center mt-8">
        <button
          onClick={() => containerRef.current.scrollBy({ left: -300, behavior: "smooth" })}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 mr-4"
        >
          <FaChevronLeft />
        </button>

        <div ref={containerRef} className="flex overflow-x-auto gap-6 transition-all duration-500 flex-1">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-purple-100 rounded-lg shadow-md p-4 min-w-[300px]">
                <div className="flex items-center space-x-2">
                  {review.user?.profile_picture ? (
                    <img src={review.user.profile_picture} alt={review.user.username} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold text-lg">
                      {review.user?.username ? review.user.username[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <h4 className="font-semibold">{review.user?.username || username}</h4>
                </div>
                <div className="flex mt-2">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to add one!</p>
          )}
        </div>

        <button
          onClick={() => containerRef.current.scrollBy({ left: 300, behavior: "smooth" })}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 ml-4"
        >
          <FaChevronRight />
        </button>
      </div>

      {isModalOpen && <AddReview isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleReviewSubmit} />}
    </div>
  );
};

export default Reviews;
