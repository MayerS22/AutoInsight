/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import AddReview from "./AddReview";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'; // Import SweetAlert



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
  // More reviews...
];

const Reviews = () => {
  // const { isLoggedIn, setIsLoggedIn } = useOutletContext(); // Access context
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState(reviewsData);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  console.log("Reviews isLoggedIn:", isLoggedIn); // Debugging



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
        console.log("Redirecting to login from:", location.pathname);
        localStorage.setItem('redirectUrl', window.location.pathname);
        navigate("/login");
      });
    }
  };


  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      const reviewWidth = container.firstChild.offsetWidth + 10; // Adding some gap
      container.scrollBy({
        left: reviewWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      const reviewWidth = container.firstChild.offsetWidth + 10; // Adding some gap
      container.scrollBy({
        left: -reviewWidth,
        behavior: "smooth",
      });
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      { id: prevReviews.length + 1, ...newReview },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-14">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-purple-900">
            Here Are Few Words From Our Customers
          </h2>
          <p className="text-lg text-purple-700 mt-2">We Want To Hear From You Too</p>
        </div>
        <button
          onClick={handleAddReview}
          className="bg-purple-900 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Add Review
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto mt-8 gap-6 transition-all duration-500"
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
              <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full" />
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

      <div className="flex justify-between mt-4 mb-0">
        <button
          onClick={handleScrollLeft}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleScrollRight}
          className="bg-purple-900 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition duration-500 transform hover:scale-110"
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