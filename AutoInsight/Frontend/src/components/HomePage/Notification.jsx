import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { marginActions } from '../../store/index';
import { Allignment } from '../Profile/Allignment';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/notifications/', {
        params: { page: 1, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(res.data.body); // Use 'body' based on your backend
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(marginActions.setColor("bg-white"));
    dispatch(marginActions.removeUserName());
    dispatch(marginActions.addLogoutIcon());

    fetchNotifications();

    return () => {
      dispatch(marginActions.setMargin(""));
      dispatch(marginActions.setColor("bg-purple-50"));
      dispatch(marginActions.addUserName());
      dispatch(marginActions.removeLogoutIcon());
    };
  }, [dispatch]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:3000/api/v1/notifications/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <>
      <Allignment>
        <div className="max-w-2xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-center w-full">Notifications</h2>
            <button
              onClick={markAllAsRead}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              Mark All as Read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">No notifications found.</div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-white shadow-md rounded-lg p-4 transition ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="text-gray-800">{notification.message}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>

                  <div className="flex gap-4 mt-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Allignment>
    </>
  );
};

export default Notification;
