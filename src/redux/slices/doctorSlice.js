// src/redux/slices/doctorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../../services/api";

// ---------------- IMAGE NORMALIZATION -----------------
const normalizeDoctor = (doctor) => {
  if (!doctor) return null;

  let imageUrl = null;

  if (doctor.image && typeof doctor.image === "object" && doctor.image.url) {
    imageUrl = doctor.image.url;
  } else if (typeof doctor.image === "string") {
    if (doctor.image.startsWith("http")) imageUrl = doctor.image;
    else imageUrl = `${import.meta.env.VITE_API_URL}/${doctor.image}`;
  }

  if (!imageUrl) {
    imageUrl = "https://cdn-icons-png.flaticon.com/512/2922/2922506.png"; // fallback doctor icon
  }

  return { ...doctor, image: imageUrl };
};

const initialState = {
  doctors: [],
  doctor: null,
  loading: false,
  error: null,
};

// ----------------- THUNKS -----------------

export const fetchDoctorsAsync = createAsyncThunk(
  "doctor/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.getAllDoctors();
      return (res.data || []).map(normalizeDoctor);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchDoctorByIdAsync = createAsyncThunk(
  "doctor/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.getDoctorById(id);
      return normalizeDoctor(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addDoctorAsync = createAsyncThunk(
  "doctor/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.addDoctor(formData);
      return normalizeDoctor(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDoctorAsync = createAsyncThunk(
  "doctor/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.updateDoctor(id, data);
      return normalizeDoctor(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDoctorByMeAsync = createAsyncThunk(
  "doctor/updateByMe",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.updateDoctorByMe(formData);
      return normalizeDoctor(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteDoctorAsync = createAsyncThunk(
  "doctor/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.deleteDoctor(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ----------------- SLICE -----------------
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all doctors
      .addCase(fetchDoctorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch doctor by ID
      .addCase(fetchDoctorByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add doctor
      .addCase(addDoctorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDoctorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload);
      })
      .addCase(addDoctorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update doctor
      .addCase(updateDoctorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.doctors = state.doctors.map((d) =>
          d._id === updated._id ? updated : d
        );
        if (state.doctor && state.doctor._id === updated._id)
          state.doctor = updated;
      })
      .addCase(updateDoctorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update doctor by me
      .addCase(updateDoctorByMeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorByMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(updateDoctorByMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete doctor
      .addCase(deleteDoctorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctorAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter((d) => d._id !== action.payload);
      })
      .addCase(deleteDoctorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
