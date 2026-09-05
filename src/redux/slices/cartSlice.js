// Frontend/src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const loadCartFromStorage = () => {
//   const storedCart = localStorage.getItem("cart");
//   return storedCart ? JSON.parse(storedCart) : { products: [] };
//   // return storedCart
//   //   ? JSON.parse(storedCart)
//   //   : { cart: { products: [] }, loading: false, error: null };
// };
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");

  return storedCart
    ? {
        cart: JSON.parse(storedCart),
        loading: false,
        error: null,
      }
    : {
        cart: {
          products: [],
          totalPrice: 0,
        },
        loading: false,
        error: null,
      };
};
// helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
// fetch cart for user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/all`,
        {
          params: { userId, guestId },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

//add am item to cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId, image },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/create`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
          image,
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

//update the quantity of an item in the cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        { productId, quantity, guestId, userId, size, color },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

// remove an item from the cart for a user or guest
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart/delete`,
        data: { productId, quantity, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);
// merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),

  reducers: {
    clearCart: (state) => {
      state.cart = {
        products: [],
        totalPrice: 0,
      };

      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    // fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // builder.addCase(fetchCart.fulfilled, (state, action) => {
    //   state.loading = false;

    //   // Backend returns { cart: ... }
    //   state.cart = action.payload.cart;

    //   saveCartToStorage(action.payload.cart);
    // });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;

      console.log("STATE CART AFTER SET:", state.cart);
      saveCartToStorage(action.payload.cart);
    });

    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch cart";
    });

    // add to cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;

      state.cart = action.payload.cart;

      saveCartToStorage(action.payload.cart);
    });

    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to add cart";
    });

    // update quantity
    builder.addCase(updateCartItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.loading = false;

      state.cart = action.payload.cart;

      saveCartToStorage(action.payload.cart);
    });

    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update item quantity";
    });

    // remove item
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;

      state.cart = action.payload.cart;

      saveCartToStorage(action.payload.cart);
    });

    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message || "Failed to remove item from cart";
    });

    // merge cart
    builder.addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(mergeCart.fulfilled, (state, action) => {
      state.loading = false;

      // merge endpoint returns cart wrapped in { cart: ... }
      state.cart = action.payload.cart;

      saveCartToStorage(action.payload);
    });

    builder.addCase(mergeCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to merge cart";
    });
  },
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
