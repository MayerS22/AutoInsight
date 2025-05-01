/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const MobileNotification = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useSelector((state) => state.margin.isMobile)

  const fetchNotifications = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get('http://localhost:3000/api/v1/notifications/', {
        params: { page: 1, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(res.data.body);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, read: true } : notif));
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
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  if (!isOpen) return null;

  return (

    <>
      {
      // !isMobile &&
       (<div className="absolute right-0 mt-2 w-80 bg-purple-50 rounded-lg border shadow-lg z-50">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <li key={notification._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification._id)} className="text-purple-600 hover:text-purple-800">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notification._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>)}

    </>

  );
};

export default MobileNotification;