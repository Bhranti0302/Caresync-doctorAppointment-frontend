// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ---------------- IMAGE NORMALIZATION -----------------
const normalizeUser = (user) => {
  if (!user) return null;

  let imageUrl = null;

  // Check if image is object (Cloudinary)
  if (user.image && typeof user.image === "object" && user.image.url) {
    imageUrl = user.image.url;
  } 
  // Check if image is string (old local path)
  else if (typeof user.image === "string") {
    imageUrl = user.image.startsWith("http")
      ? user.image
      : `${import.meta.env.VITE_API_URL}/${user.image}`;
  }

  // Default image
  if (!imageUrl) {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }

  return { ...user, image: imageUrl };
};

// ---------------- INITIAL STATE -----------------
const initialState = {
  myProfile: null,
  selectedUser: null,
  allUsers: [],
  loading: false,
  error: null,
};

// ----------------- THUNKS -----------------

// Fetch logged-in user's profile
export const fetchMyProfileAsync = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.getUserProfile();
      return normalizeUser(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update logged-in user's profile (supports image upload)
export const updateMyProfileAsync = createAsyncThunk(
  "user/updateMyProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.updateUserProfile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return normalizeUser(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return rejectWithValue(msg);
    }
  }
);

// Delete logged-in user's account
export const deleteMyAccountAsync = createAsyncThunk(
  "user/deleteMyAccount",
  async (_, { rejectWithValue }) => {
    try {
      await API.deleteMyAccount();
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return rejectWithValue(msg);
    }
  }
);

// Fetch all users (admin)
export const fetchAllUsersAsync = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.getAllUsers();
      return (res.data || []).map(normalizeUser);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single user by ID (admin)
export const fetchUserByIdAsync = createAsyncThunk(
  "user/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.getUserById(id);
      return normalizeUser(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ----------------- SLICE -----------------
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my profile
      .addCase(fetchMyProfileAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchMyProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update my profile
      .addCase(updateMyProfileAsync.pending, (state) => { state.loading = true; })
      .addCase(updateMyProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(updateMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete my account
      .addCase(deleteMyAccountAsync.pending, (state) => { state.loading = true; })
      .addCase(deleteMyAccountAsync.fulfilled, (state) => {
        state.loading = false;
        state.myProfile = null;
      })
      .addCase(deleteMyAccountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all users
      .addCase(fetchAllUsersAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user by ID
      .addCase(fetchUserByIdAsync.pending, (state) => { state.loading = true; })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
