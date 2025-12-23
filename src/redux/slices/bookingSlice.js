import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../../services/api";

const initialState = {
  bookings: [],
  booking: null,
  doctor: null,
  date: null,
  time: null,
  doctorSlots: [],
  loading: false,
  error: null,
};

/* ===============================
   ➕ ADD BOOKING
================================ */
export const addBookingAsync = createAsyncThunk(
  "booking/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.createAppointment(data);
     
      return res.data;
    } catch (err) {
     
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   📥 FETCH MY BOOKINGS
================================ */
export const fetchBookingsAsync = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.getAppointmentsByMe();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   👤 FETCH BOOKINGS BY USER ID
================================ */
export const fetchBookingsByUserId = createAsyncThunk(
  "booking/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await API.getAppointmentsByUserId(userId);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   🩺 FETCH BOOKINGS BY DOCTOR ID
================================ */
export const fetchBookingsByDoctorId = createAsyncThunk(
  "booking/fetchByDoctorId",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await API.getAppointmentsByDoctorId(doctorId);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   🔍 FETCH DOCTOR AVAILABLE SLOTS
================================ */
export const fetchDoctorAvailableSlotsAsync = createAsyncThunk(
  "booking/fetchDoctorSlots",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await API.getDoctorAvailableSlots(doctorId);
      const activeSlots = res.data.filter(
        (slot) => !slot.cancelled && new Date(slot.date) >= new Date()
      );
      return activeSlots;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   ✏️ UPDATE BOOKING / PAYMENT
================================ */
export const updateBookingAsync = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      let response;

      // ✅ If patient is paying, call /pay route
      if (data.paid === true) {
        response = await API.payForAppointment(id, data);
      } else {
        // Otherwise, admin/doctor update
        response = await API.updateAppointment(id, data);
      }

      
      return response.data;
    } catch (err) {
     
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   ❌ DELETE BOOKING
================================ */
export const deleteBookingAsync = createAsyncThunk(
  "booking/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.deleteAppointment(id);
      
      return id;
    } catch (err) {
      
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   📋 FETCH ALL APPOINTMENTS (ADMIN)
================================ */
export const fetchAllAppointmentsAsync = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.getAllAppointments();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   🔍 FETCH BOOKING BY ID
================================ */
export const fetchAppointmentByIdAsync = createAsyncThunk(
  "booking/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.getAppointmentById(id);
      return res.data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ===============================
   🧩 SLICE
================================ */
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ADD BOOKING */
      .addCase(addBookingAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.doctorSlots.push({
          date: action.payload.date,
          time: action.payload.time,
        });
      })
      .addCase(addBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH BOOKINGS */
      .addCase(fetchBookingsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsByDoctorId.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      /* FETCH DOCTOR SLOTS */
      .addCase(fetchDoctorAvailableSlotsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorSlots = action.payload;
      })

      /* UPDATE */
      .addCase(updateBookingAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBookingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteBookingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      })

      /* FETCH ALL (ADMIN) */
      .addCase(fetchAllAppointmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      /* FETCH BY ID */
      .addCase(fetchAppointmentByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      });
  },
});

export const { setDoctor, setDate, setTime, clearBookingError } =
  bookingSlice.actions;

export default bookingSlice.reducer;
