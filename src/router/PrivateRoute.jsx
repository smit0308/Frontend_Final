import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/features/authSlice";
import { toast } from "react-toastify";

// Global variable to track logout state
let isLoggingOut = false;

// Function to set logout state
export const setLoggingOut = (value) => {
  isLoggingOut = value;
};

export const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      // Only show the toast if we're not logging out
      if (!isLoggingOut) {
        // toast.error("Please login to access this page");
      }
      
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location]);

  return isLoggedIn ? <>{children}</> : null;
};
