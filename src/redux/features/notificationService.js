import axios from "axios";

const API_URL = "/api/notifications/";

const getNotifications = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const markAsRead = async (id) => {
  const response = await axios.put(`${API_URL}${id}`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await axios.put(`${API_URL}read-all`);
  return response.data;
};

const getUnreadCount = async () => {
  const response = await axios.get(`${API_URL}unread-count`);
  return response.data;
};

const createNotification = async (notificationData) => {
  const response = await axios.post(API_URL, notificationData);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createNotification,
};

export { createNotification };
export default notificationService; 