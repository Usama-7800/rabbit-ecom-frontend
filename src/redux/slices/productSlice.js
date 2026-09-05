import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ASYNC THUNK FOR FETCHING PRODUCTS BY COLLECTION AND OPTIONAL FILTERS
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    // const response = await axios.get(
    //   `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`,
    // );
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`,
    );
    return response.data;
  },
);

//async thunk to fetch single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
    );
    return response.data;
  },
);

// async thunk to fetch update products

export const updateProducts = createAsyncThunk(
  "products/updateSimilar",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return response.data;
  },
);

// async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`,
    );
    return response.data;
  },
);

//product slice

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null, // store the details of the single product
    similarProducts: [], // store the similar products
    loading: false,
    error: null,
    filter: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter: (state) => {
      state.filter = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    // handle fetch Products with filters
    builder.addCase(fetchProductsByFilters.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductsByFilters.fulfilled, (state, action) => {
      state.loading = false;
      state.products = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchProductsByFilters.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // handle fetch single product details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    //handle fetch update products
    builder.addCase(updateProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProducts.fulfilled, (state, action) => {
      state.loading = false;
      const updatedProduct = action.payload; // store the updated product data
      const index = state.products.findIndex(
        (product) => product._id === updatedProduct._id,
      );
      if (index !== -1) {
        state.products[index] = updatedProduct; // update the product in the products array
      }
    });
    builder.addCase(updateProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    //handle fetch similar products
    builder.addCase(fetchSimilarProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSimilarProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.similarProducts = action.payload; // store the similar products data
    });
    builder.addCase(fetchSimilarProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const { setFilter, clearFilter } = productSlice.actions;
export default productSlice.reducer;
