/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import AddReview from "./AddReview";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const reviewsData = [
  {
    id: 1,
    name: "Zain",
    rating: 5,
    review: "Really great insights; it helped me accelerate my work :)",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 2,
    name: "Aisha",
    rating: 4,
    review: "Very useful tool! It improved my workflow a lot.",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
];

const Reviews = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState(reviewsData);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    if (containerRef.current && savedScrollPosition) {
      containerRef.current.scrollLeft = parseInt(savedScrollPosition, 10);
      localStorage.removeItem("scrollPosition");
    }
  }, []);

  const handleAddReview = () => {
    if (isLoggedIn) {
      setIsModalOpen(true);
    } else {
      const scrollPosition = containerRef.current?.scrollLeft || 0;
      localStorage.setItem("scrollPosition", scrollPosition);

      Swal.fire({
        title: "You are not logged in!",
        text: "Redirecting to login page...",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.setItem("redirectUrl", window.location.pathname);
        navigate("/login");
      });
    }
  };

  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      const reviewWidth = container.firstChild.offsetWidth + 10;
      container.scrollBy({ left: reviewWidth, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      const reviewWidth = container.firstChild.offsetWidth + 10;
      container.scrollBy({ left: -reviewWidth, behavior: "smooth" });
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const words = fullName.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : `${words[0][0]}${words[1]?.[0] || ""}`.toUpperCase();
  };

  const handleReviewSubmit = (newReview) => {
    const initials = getInitials(newReview.name);
    setReviews((prevReviews) => [
      ...prevReviews,
      {
        id: prevReviews.length + 1,
        ...newReview,
        image: newReview.image || `https://via.placeholder.com/50/6B46C1/FFFFFF?text=${initials}`,
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-14">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-purple-900">
            What Our Customers Say
          </h2>
          <p className="text-lg text-purple-700 mt-2">
            We Want To Hear From You Too
          </p>
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
          onClick={handleScrollLeft}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 mr-4"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-6 transition-all duration-500 flex-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            height: "auto",
            marginBottom: "0",
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-purple-100 rounded-lg shadow-md p-4 transform transition-all duration-500 scale-95 hover:scale-100 min-w-[300px]"
            >
              <div className="flex items-center space-x-2">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(review.name)}
                  </div>
                )}
                <h4 className="font-semibold">{review.name}</h4>
              </div>
              <div className="flex mt-2">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <FaStar key={index} className="text-yellow-500" />
                ))}
              </div>
              <p className="mt-2 text-gray-700">{review.review}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleScrollRight}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110 ml-4"
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
