import axios from "axios";

// Backend base URL
export const BACKEND_BASE_URL = "https://caresync-doctorappointment.onrender.com/api";

// Axios instance
const API = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

/* ============================
   🔐 AUTH API
============================ */
export const registerUser = (data) =>
  API.post("/auth/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (token, data) =>
  API.put(`/auth/reset-password/${token}`, data);

/* ============================
   👤 USER API
============================ */
export const getAllUsers = () => API.get("/users");
export const getUserById = (id) => API.get(`/users/${id}`);
export const getUserProfile = () => API.get("/users/profile/me");

export const updateUserProfile = (data) =>
  API.put("/users/profile/me", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteUser = (id) => API.delete(`/users/${id}`);
export const deleteMyAccount = () => API.delete("/users/me");

/* ============================
   🩺 DOCTOR API
============================ */
export const getAllDoctors = () => API.get("/doctors");
export const getDoctorById = (id) => API.get(`/doctors/${id}`);

export const addDoctor = (data) =>
  API.post("/doctors", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateDoctor = (id, data) =>
  API.put(`/doctors/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

export const updateDoctorByMe = (data) =>
  API.put("/doctors/me/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* ============================
   📅 APPOINTMENTS API
============================ */
export const createAppointment = (data) => API.post("/appointments", data);

export const getAppointmentsByMe = () => API.get("/appointments/me");

export const getAppointmentById = (id) => API.get(`/appointments/${id}`);

// ⭐ For Admin / Doctor — update status, date, time
export const updateAppointment = (id, data) =>
  API.put(`/appointments/${id}`, data);

// ❌ NO `/pay` here — this is for admin updates only

export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

export const getAllAppointments = () => API.get("/appointments");

export const getAppointmentsByUserId = (userId) =>
  API.get(`/appointments/user/${userId}`);

export const getAppointmentsByDoctorId = (doctorId) =>
  API.get(`/appointments/doctor/${doctorId}`);

export const getDoctorAvailableSlots = (doctorId) =>
  API.get(`/appointments/doctor-slots/${doctorId}`);

/* ============================
   💳 PAYMENT API (Stripe)
============================ */
export const createPaymentIntent = async (appointmentId) => {
  const { data } = await API.post("/payment/create-payment-intent", {
    appointmentId,
  });
  return data;
};

// ⭐ Patient Payment — only patient uses this route
export const payForAppointment = (id, data) =>
  API.put(`/appointments/${id}/pay`, data);

/* ============================
   📦 DEFAULT EXPORT
============================ */
export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,

  // Users
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  deleteMyAccount,

  // Doctors
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorByMe,

  // Appointments
  createAppointment,
  getAppointmentsByMe,
  getAppointmentById,
  updateAppointment, // ✔ Admin update
  payForAppointment, // ✔ Patient payment
  deleteAppointment,
  getAllAppointments,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  getDoctorAvailableSlots,

  // Payment
  createPaymentIntent,
};
