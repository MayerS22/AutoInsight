/* eslint-disable react/prop-types */

const RecentAccounts = ({ accounts }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Recent Created Accounts</h2>
      <div className="space-y-4">
        {accounts.map((user, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center`}
              >
                <span className="text-white text-sm">{user.initial}</span>
              </div>
              <span className="ml-3 font-medium">{user.name}</span>
            </div>
            <span className="text-sm text-gray-500">{user.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAccounts;