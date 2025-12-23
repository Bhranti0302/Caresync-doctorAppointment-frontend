import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "./slices/doctorSlice";
import bookingReducer from "./slices/bookingSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    booking: bookingReducer,
    auth: authReducer,
    user: userReducer,
  },
});
