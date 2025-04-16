import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import biddingService from '../services/bidService';
import { toast } from 'react-toastify';

const initialState = {
    history: [],  
    bidding: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const placebid = createAsyncThunk("bid/create", async (formData, thunkAPI) => {
    try {
        console.log("Placing bid with:", formData);
        // Ensure price is a number
        const bidData = {
            ...formData,
            price: parseFloat(formData.price)
        };
        return await biddingService.placebid(bidData);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to place bid";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

export const fetchbiddingHistory = createAsyncThunk("bid/get", async (productId, thunkAPI) => {
    try {
        return await biddingService.fetchbiddingHistory(productId);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch bidding history";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

export const sellproductsbyuser = createAsyncThunk("bid/sell", async (productId, thunkAPI) => {
    try {
        return await biddingService.sellproductsbyuser(productId);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to sell product";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

const biddingSlice = createSlice({
    name: "bidding",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(placebid.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(placebid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = action.payload?.message || "Bid placed successfully";
                toast.success(state.message);
            })
            .addCase(placebid.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            .addCase(fetchbiddingHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchbiddingHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.history = action.payload;
            })
            .addCase(fetchbiddingHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(sellproductsbyuser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sellproductsbyuser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = action.payload?.message || "Product sold successfully";
            })
            .addCase(sellproductsbyuser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export default biddingSlice.reducer;