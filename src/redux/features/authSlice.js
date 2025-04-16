import { createAsyncThunk , createSlice } from '@reduxjs/toolkit'
import authService from "../services/authFeature";
import {toast} from 'react-toastify';

const initialState = {
    user : JSON.parse(localStorage.getItem("user")) || null,
    users: [],  
    income: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    isEmailVerified: false
};

export const register = createAsyncThunk("auth/register", async (userData,thunkAPI) => {
  try{
    const response = await authService.register(userData);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const verifyEmail = createAsyncThunk("auth/verify-email", async (verificationToken, thunkAPI) => {
  try {
    const response = await authService.verifyEmail(verificationToken);
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk("auth/login", async (userData,thunkAPI) => {
  try{
    const response = await authService.login(userData);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const logOut = createAsyncThunk("auth/logOut", async (_, thunkAPI) => {
  try{
    await authService.logOut();
    localStorage.removeItem("user");
    
    // Instead of reloading the page, we'll let the component handle navigation
    // with the proper state parameter
    return { success: true };
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getLoginStatus = createAsyncThunk("auth/status", async (_, thunkAPI) => {
  try{
    return await authService.getLoginStatus();
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getuserProfile = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
  try{
    return await authService.getuserProfile();
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const loginUserAsSeller = createAsyncThunk("auth/login-as-seller", async (userData, thunkAPI) => {
  try{
    const response = await authService.loginUserAsSeller(userData);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getUserIncome = createAsyncThunk("auth/get-income", async (_, thunkAPI) => {
  try{
    return await authService.getUserIncome();
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getIncome = createAsyncThunk("auth/get-income-of-admin", async (_, thunkAPI) => {
  try{
    return await authService.getIncome();
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getAllUser = createAsyncThunk("auth/getallusers", async (_, thunkAPI) => {
  try{
    return await authService.getAllUser();
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk("auth/update", async (userData, thunkAPI) => {
  try {
    const response = await authService.updateUser(userData);
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const deleteUser = createAsyncThunk("auth/delete", async (userId, thunkAPI) => {
  try {
    const response = await authService.deleteUser(userId);
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state) {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
},
extraReducers: (builder) => {
  builder
    .addCase(register.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.user = action.payload;
      toast.success(action.payload.message || "Registration successful!");
    })
    .addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.user = null;
      toast.error(action.payload) 
    })
    .addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verifyEmail.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isEmailVerified = true;
      toast.success("Email verified successfully!");
    })
    .addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.isEmailVerified = false;
      toast.error(action.payload);
    })
    .addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.user = action.payload;
    })
    .addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.user = null;
      toast.error(action.payload) 
    })
    .addCase(loginUserAsSeller.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUserAsSeller.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      state.isError = false;
      toast.success("You become a seller");
    })
    .addCase(loginUserAsSeller.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.user = null;
      toast.error(action.payload); 
    })
    .addCase(logOut.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(logOut.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = false;  // Changed from true to false
      state.user = null;
      toast.success("Logged out successfully"); // Fixed success message
      
      // Reset the isLoggingOut flag after a short delay
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.setLoggingOut) {
          window.setLoggingOut(false);
        }
      }, 1000);
    })
    .addCase(logOut.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      toast.error(action.payload); 
    })
    .addCase(getLoginStatus.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getLoginStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = action.payload;
    })
    .addCase(getLoginStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })
    .addCase(getuserProfile.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getuserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    })
    .addCase(getuserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      localStorage.removeItem("user");
      state.isLoggedIn = false;
      state.user = null;
    })
    .addCase(getUserIncome.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getUserIncome.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.income = action.payload;
    })
    .addCase(getUserIncome.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.isLoggedIn = true;
    })
    .addCase(getIncome.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getIncome.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.income = action.payload;
      console.log("Admin Income Fetched:", action.payload);  // Debugging log
    })
    .addCase(getIncome.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.isLoggedIn = true;
    })
    .addCase(getAllUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.users = action.payload;
      state.totalUsers = action.payload?.length;
    })
    .addCase(getAllUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.isLoggedIn = true;
    })
    .addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      toast.error(action.payload);
    })
    .addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.users = state.users.filter(user => user._id !== action.payload._id);
      toast.success("User deleted successfully");
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      toast.error(action.payload);
    });
},
});

export const { RESET } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectIsSuccess = (state) => state.auth.isSuccess;
export const selectIsEmailVerified = (state) => state.auth.isEmailVerified;
export default authSlice.reducer;