/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { marginActions } from '../../store/index';
import { Allignment } from '../Profile/Allignment';
import { Bell, CheckCircle, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

const DesktopNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const isMobile = useSelector((state) => state.margin.isMobile)


    const fetchNotifications = async (showRefreshing = false) => {
        if (showRefreshing) setIsRefreshing(true);

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
            if (showRefreshing) setIsRefreshing(false);
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

            // Update locally instead of re-fetching
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, read: true } : notif
                )
            );
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

            // Update locally instead of re-fetching
            setNotifications(prev => prev.filter(notif => notif._id !== id));
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

            // Update locally instead of re-fetching
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/notifications/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Clear all notifications locally
            setNotifications([]);
        } catch (err) {
            console.error('Failed to delete all notifications', err);
        }
    };

    const getNotificationIcon = (notification) => {
        // You could customize this based on notification type
        if (notification.type === 'error') {
            return <AlertCircle className="text-red-500" size={20} />;
        } else if (notification.type === 'success') {
            return <CheckCircle className="text-green-500" size={20} />;
        }
        return <Bell className="text-purple-500" size={20} />;
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <Allignment>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading notifications...</p>
                </div>
            </Allignment>
        );
    }

    if (error) {
        return (
            <Allignment>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        <button
                            onClick={() => fetchNotifications()}
                            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Allignment>
        );
    }
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            {
            
            isMobile && 
            <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-32">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 sm:p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Bell className="text-white" size={24} />
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="bg-white text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fetchNotifications(true)}
                                    className="p-2 bg-purple-700 hover:bg-purple-900 text-white rounded-full transition-all"
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                                </button>
                                <button
                                    onClick={markAllAsRead}
                                    disabled={unreadCount === 0}
                                    className={`hidden sm:block px-3 py-2 rounded-md text-sm font-medium transition-all ${unreadCount > 0
                                        ? "bg-white text-purple-800 hover:bg-purple-100"
                                        : "bg-purple-500 text-purple-200 cursor-not-allowed"
                                        }`}
                                >
                                    Mark All Read
                                </button>
                                <button
                                    onClick={deleteAllNotifications}
                                    disabled={notifications.length === 0}
                                    className={`hidden sm:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${notifications.length > 0
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-red-300 text-red-100 cursor-not-allowed"
                                        }`}
                                >
                                    <Trash2 size={14} className="mr-1" />
                                    Delete All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Buttons */}
                    {(unreadCount > 0 || notifications.length > 0) && (
                        <div className="sm:hidden p-3 bg-gray-50 border-b">
                            <div className="flex space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                                    >
                                        Mark All as Read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={deleteAllNotifications}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium"
                                    >
                                        <Trash2 size={14} className="mr-1" />
                                        Delete All
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notifications List */}
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <Bell className="text-gray-300 mb-3" size={48} />
                            <p className="text-gray-500 text-lg">No notifications yet</p>
                            <p className="text-gray-400 text-sm mt-1">
                                You're all caught up! We'll notify you when there's something new.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className={`relative p-4 sm:p-5 transition-all hover:bg-gray-50 ${notification.read ? 'bg-white' : 'bg-purple-50'
                                        }`}
                                >
                                    <div className="flex">
                                        <div className="mr-4">
                                            {getNotificationIcon(notification)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-gray-800 ${!notification.read ? 'font-medium' : ''}`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                                <span>{getTimeAgo(notification.createdAt)}</span>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                                                    >
                                                        <CheckCircle size={16} className="mr-1" />
                                                        Mark as read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="inline-flex items-center text-sm text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    <Trash2 size={16} className="mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {!notification.read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-purple-600 rounded-full"></div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>}
        </>
    );
};

export default DesktopNotification;