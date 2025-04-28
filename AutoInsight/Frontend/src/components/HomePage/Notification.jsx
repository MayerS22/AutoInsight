import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { marginActions } from '../../store/index';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const dispatch = useDispatch();

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/notifications', {
          params: {
            page: 1,
            limit: 10, // you can change page and limit
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // replace with actual token
          },
        });
        setNotifications(res.data.data); // assuming your API sends { data: [...] }
      } catch (err) {
        console.error(err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">No notifications found.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification._id} className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="text-gray-800">{notification.message}</div>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
