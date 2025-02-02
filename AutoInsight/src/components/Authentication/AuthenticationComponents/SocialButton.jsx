/* eslint-disable react/prop-types */
const SocialButton = ({ icon, text }) => {
    return (
      <div className="flex justify-center">
      <button className="w-2/3 flex items-center justify-center border-purple-900 border p-2 rounded-lg hover:bg-gray-100 ">
        <img src={icon} alt="" className="mr-2" /> {/* Logo aligned to the left with margin */}
        <span className="flex-grow text-center font-bold text-purple-900">{text}</span> {/* Text centered */}
      </button>
      </div>
    );
  };
  
  export default SocialButton;
  