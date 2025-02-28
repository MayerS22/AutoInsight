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
  const [reviews, setReviews] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/reviews");
      setReviews(response.data.body);
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

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    fetchReviews();
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-center sm:text-left">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-900">
            What Our Customers Say
          </h2>
          <p className="text-lg sm:text-xl text-purple-700 mt-2">
            We Want To Hear From You Too
          </p>
        </div>
        <button
          onClick={handleAddReview}
          className="bg-purple-900 text-white px-6 sm:px-8 py-2 sm:py-3 text-lg rounded-lg hover:bg-purple-700 transition duration-300 mt-4 sm:mt-0"
        >
          Add Review
        </button>
      </div>

      {/* Reviews Section */}
      <div className="flex items-center mt-8">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="bg-purple-900 text-white p-3 sm:p-4 text-xl sm:text-2xl rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 mr-4 sm:mr-6 hidden sm:block"
        >
          <FaChevronLeft />
        </button>

        {/* Reviews Container */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto sm:overflow-hidden w-full scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-purple-100 rounded-lg shadow-md p-5 sm:p-6 min-w-[320px] sm:min-w-[400px] max-w-full sm:max-w-none flex-shrink-0"
              >
                <div className="flex items-center space-x-3">
                  {review.user?.profile_picture ? (
                    <img
                      src={review.user.profile_picture}
                      alt={review.user.username}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {review.user?.username
                        ? review.user.username[0].toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <h4 className="font-semibold text-base sm:text-lg">
                    {review.user?.username || "Anonymous"}
                  </h4>
                </div>
                <div className="flex mt-3">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <FaStar key={index} className="text-yellow-500 text-lg sm:text-xl" />
                  ))}
                </div>
                <p className="mt-3 text-base sm:text-lg text-gray-700">
                  {review.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg">
              No reviews yet. Be the first to add one!
            </p>
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="bg-purple-900 text-white p-3 sm:p-4 text-xl sm:text-2xl rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 ml-4 sm:ml-6 hidden sm:block"
        >
          <FaChevronRight />
        </button>
      </div>

      {isModalOpen && (
        <AddReview
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default Reviews;
