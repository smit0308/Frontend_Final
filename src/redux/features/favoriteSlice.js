import { createSlice } from "@reduxjs/toolkit";

// Load favorites from localStorage
const loadFavorites = () => {
  try {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

const initialState = {
  favorites: loadFavorites(),
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      const existingIndex = state.favorites.indexOf(productId);
      
      if (existingIndex >= 0) {
        state.favorites.splice(existingIndex, 1);
      } else {
        state.favorites.push(productId);
      }

      // Save to localStorage
      try {
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoriteSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;

export default favoriteSlice.reducer; 