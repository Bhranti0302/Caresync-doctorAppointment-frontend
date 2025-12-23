// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// ----------------- LOGIN -----------------
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.loginUser(credentials);
      const user = response.data.user;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ----------------- REGISTER -----------------
export const registerUserAsync = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.registerUser(formData);
      const user = response.data.user;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// ----------------- FETCH LOGGED-IN USER -----------------
export const fetchLoggedInUserAsync = createAsyncThunk(
  "auth/fetchLoggedInUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.getUserProfile();
      const user = response.data.user;
      if (user) localStorage.setItem("loggedInUser", JSON.stringify(user));
      return user;
    } catch (err) {
      // Do NOT clear localStorage on failure
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

// ----------------- INITIAL STATE -----------------
const getLoggedInUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("loggedInUser");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse localStorage user:", err);
    localStorage.removeItem("loggedInUser");
    return null;
  }
};

const initialState = {
  loggedInUser: getLoggedInUserFromStorage(),
  loading: false,
  error: null,
};

// ----------------- SLICE -----------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
      localStorage.setItem("loggedInUser", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      localStorage.removeItem("loggedInUser");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedInUser = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedInUser = action.payload;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH LOGGED-IN USER
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.loggedInUser = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.rejected, (state) => {
        state.loading = false;
        state.error = null; // keep user intact
      });
  },
});

export const { setLoggedInUser, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
