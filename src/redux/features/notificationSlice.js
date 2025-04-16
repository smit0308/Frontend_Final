import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "./notificationService";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('notificationState');
    if (serializedState === null) {
      return {
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        isError: false,
        message: "",
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      isError: false,
      message: "",
    };
  }
};

const initialState = loadState();

export const getNotifications = createAsyncThunk(
  "notifications/getAll",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    reset: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.isLoading = false;
      state.isError = false;
      state.message = "";
      localStorage.removeItem('notificationState');
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem('notificationState', JSON.stringify(state));
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
      localStorage.setItem('notificationState', JSON.stringify(state));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        localStorage.setItem('notificationState', JSON.stringify(state));
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        localStorage.setItem('notificationState', JSON.stringify(state));
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
        localStorage.setItem('notificationState', JSON.stringify(state));
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
        localStorage.setItem('notificationState', JSON.stringify(state));
      });
  },
});

export const { reset, updateNotifications, updateUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;