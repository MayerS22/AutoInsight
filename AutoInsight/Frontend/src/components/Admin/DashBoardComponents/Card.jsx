const Card = ({ icon, label, value, badge }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-start">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
        <img src={icon} alt={label} className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center mt-2">
        <h3 className="text-xl font-bold text-orig/500">{value}</h3>
        {badge && (
          <span className="ml-2 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;