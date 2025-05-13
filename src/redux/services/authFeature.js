import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const AUTH_URL = `${BACKEND_URL}/users/`;

const register = async (userData) => {
    const response = await axios.post(AUTH_URL + "register", userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(AUTH_URL + "login", userData, {
        withCredentials: true
      });
    return response.data;
};

const logOut = async () => {
    const response = await axios.get(AUTH_URL + "logout", { withCredentials: true });
    return response.data.message;
};

const getLoginStatus = async () => {
    const response = await axios.get(AUTH_URL + "loggedin", { withCredentials: true });
    return response.data;
};

const getuserProfile = async () => {
    const response = await axios.get(AUTH_URL + "getuser", { withCredentials: true });
    return response.data;
};

const updateUser = async (userData) => {
    const response = await axios.patch(AUTH_URL + "updateuser", userData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const loginUserAsSeller = async (userData) => {
    const response = await axios.post(`${AUTH_URL}/seller/`, userData, {
        withCredentials: true,
    });
    return response.data;
};

const getUserIncome = async () => {
    const response = await axios.get(AUTH_URL + "sell-amount", { withCredentials: true });
    return response.data;
};

//only access for admin user
const getIncome = async () => {
    const response = await axios.get(AUTH_URL + "estimate-income", { withCredentials: true });
    return response.data;
};

const getAllUser = async () => {
    const response = await axios.get(AUTH_URL + "users", { withCredentials: true });
    return response.data;
};

const deleteUser = async (userId) => {
    const response = await axios.delete(`${AUTH_URL}${userId}`, { withCredentials: true });
    return response.data;
};

const verifyEmail = async (token) => {
    const response = await axios.post(AUTH_URL + `verify-email/${token}`);
    return response.data;
};

const authService = {
    register,
    login, 
    logOut,
    getLoginStatus,
    getuserProfile,
    updateUser,
    loginUserAsSeller,
    getUserIncome,
    getIncome,
    getAllUser,
    verifyEmail,
    deleteUser
};

export default authService;