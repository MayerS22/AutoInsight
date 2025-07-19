import PropTypes from 'prop-types';

const EmptyState = ({ message = "No data available" }) => {
  return (
    <div className="flex flex-col mt-3 items-center justify-center w-full h-64  rounded-lg ">
      <svg
        className="w-16 h-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string
};

export default EmptyState; 