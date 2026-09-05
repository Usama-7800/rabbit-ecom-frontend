import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// retrive user info and token from local storage  if available
// const userFromStorage = localStorage.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//check foran existing guest ID in local storage or genrate a new one
const initalGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initalGuestId);
//initial state for the auth slice
const initialState = {
  user: userFromStorage,
  guestId: initalGuestId,
  loading: false,
  error: null,
};

// async thunnk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData,
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; // Return the user data from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// async thunnk for user Registration
export const registrationUser = createAsyncThunk(
  "auth/registrationUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData,
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; // Return the user data from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// create slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; //reset guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId); //update guest ID in local storage
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId); //update guest ID in local storage
    },
  },
  extraReducers: (builder) => {
    //login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    //registration user
    builder.addCase(registrationUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registrationUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registrationUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});
export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
