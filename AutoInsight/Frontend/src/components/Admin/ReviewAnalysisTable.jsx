/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleIcon from "../../assets/Toggle.svg"
import BackIcon from "../../assets/Back.svg"
import { Reviews } from '../../util/reviews';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { marginActions } from '../../store/index.js';

export default function ReviewsAnalysis() {
  const [reviews, setReviews] = useState(Reviews);

  // ✅ Show all by default
  const [filter, setFilter] = useState(["Positive", "Negative"]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleFilterOption = (classification) => {
    setFilter(prev =>
      prev.includes(classification)
        ? prev.filter(item => item !== classification)
        : [...prev, classification]
    );
  };


  
    useEffect(() => {
      dispatch(marginActions.setColor("bg-white"));
      dispatch(marginActions.removeUserName());
      dispatch(marginActions.addLogoutIcon());
  
      return () => {
        dispatch(marginActions.setMargin(""));
        dispatch(marginActions.setColor("bg-purple-50"));
        dispatch(marginActions.addUserName());
        dispatch(marginActions.removeLogoutIcon());
      };
    }, [dispatch]);

  const filteredReviews = filter.length > 0
    ? reviews.filter(review => filter.includes(review.classification))
    : reviews;

  return (
    <div className="bg-white min-h-screen mt-32">
      <div className="max-w-[1200px] mx-auto">
        <div className="p-4">
          <div onClick={()=>{navigate("/admin")}} className="flex items-center cursor-pointer text-purple-950 font-bold text-3xl mb-12 w-[270px]">
            <img src={BackIcon}  alt="back-button" className="w-5 h-5 mt-1 mr-3" />
            <h1>Reviews Analysis</h1>
          </div>

          <div className="overflow-x-auto ">
            <table className="w-full  border-2 border-black rounded-md  text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4  text-gray-800 border-2 border-black font-bold text-2xl">Reviews</th>
                  <th className="w-49 text-left py-3 px-4 font-medium text-gray-800 border-2 border-black relative">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-2xl font-bold">
                        <span>Classified as</span>
                      </div>
                      <div
                        className="bg-purple-800 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs cursor-pointer"
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        <img src={ToggleIcon} alt="toggle-button" />
                      </div>
                    </div>

                    {showFilter && (
                      <div className="absolute top-full right-0 mt-2 bg-purple-100 shadow-md rounded-md z-10 w-40 p-2 space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-purple-900 cursor-pointer">
                          <input
                            type="checkbox"
                            value="Positive"
                            checked={filter.includes("Positive")}
                            onChange={() => toggleFilterOption("Positive")}
                            className="accent-purple-700"
                          />
                          Positive
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-purple-900 cursor-pointer">
                          <input
                            type="checkbox"
                            value="Negative"
                            checked={filter.includes("Negative")}
                            onChange={() => toggleFilterOption("Negative")}
                            className="accent-purple-700"
                          />
                          Negative
                        </label>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review, index) => {
                  const isPositive = review.classification === "Positive";
                  const rowBgColor = isPositive ? "bg-green-50" : "bg-red-50";
                  const textColor = isPositive ? "text-green-600" : "text-red-600";

                  return (
                    <tr key={index} className={`${rowBgColor} text-xs sm:text-sm`}>
                      <td className="py-3 px-4 border-2 border-black items-center text-lg">{review.text}</td>
                      <td className={`py-3 px-4 border-2 border-black ${textColor} text-center text-lg`}>
                        {review.classification}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
