import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-order`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
// async thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
const orderSlice = createSlice({
    name: "order",
    initialState: {
      orders:[],
      totalOrders: 0,
      orderDetails: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      //fetch user orders
      builder.addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
      builder.addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch orders";
      });
      // fetch order details by ID
      builder.addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      });
      builder.addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch order details";
      });
    }
})

export default orderSlice.reducer;