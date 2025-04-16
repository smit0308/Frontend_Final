import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoNotificationsOutline } from 'react-icons/io5';
import { markAsRead, markAllAsRead, getNotifications, getUnreadCount, updateNotifications, updateUnreadCount } from '../../redux/features/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { DateFormatter } from '../../router';

export const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notificationsData, unreadCountData] = await Promise.all([
          dispatch(getNotifications()).unwrap(),
          dispatch(getUnreadCount()).unwrap()
        ]);
        
        // Update local storage with fresh data
        dispatch(updateNotifications(notificationsData));
        dispatch(updateUnreadCount(unreadCountData.count));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Periodic refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getNotifications());
      dispatch(getUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const result = await dispatch(markAsRead(notification._id)).unwrap();
        
        // Update local state immediately
        const updatedNotifications = notifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        );
        
        // Update Redux state and localStorage
        dispatch(updateNotifications(updatedNotifications));
        dispatch(updateUnreadCount(Math.max(0, unreadCount - 1)));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    navigate(notification.link);
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      
      // Update local state immediately
      const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
      
      // Update Redux state and localStorage
      dispatch(updateNotifications(updatedNotifications));
      dispatch(updateUnreadCount(0));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-green transition-colors"
      >
        <IoNotificationsOutline size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green hover:text-green-600"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <DateFormatter date={notification.createdAt} />
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-green rounded-full"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 