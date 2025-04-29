/* eslint-disable react/prop-types */

const RecentAccounts = ({ accounts }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Recent Created Accounts</h2>
      <div className="space-y-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{user.initial}</span>
                  </div>
                )}
                <span className="ml-3 font-medium">{user.name}</span>
              </div>
              <span className="text-sm text-gray-500">{user.time}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No recent accounts to display</div>
        )}
      </div>
    </div>
  );
};

export default RecentAccounts;
