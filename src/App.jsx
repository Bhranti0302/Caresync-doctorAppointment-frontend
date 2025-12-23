import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

// Redux Actions
import {
  setLoggedInUser,
  fetchLoggedInUserAsync,
} from "./redux/slices/authSlice";
import { fetchMyProfileAsync } from "./redux/slices/userSlice";

// Navbar Components
import UserNavList from "./components/layout/Navbar/UserNavList";
import AdminNavList from "./components/layout/Navbar/AdminNavList";
import DoctorNavList from "./components/layout/Navbar/DoctorNavList";
import GuestNavList from "./components/layout/Navbar/GuestNavList";

// Pages
import Home from "./pages/Home";
import AllDoctors from "./pages/AllDoctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./features/users/LoginPage";
import SignupPage from "./features/users/SignupPage";
import MyProfile from "./features/users/MyProfile";
import MyAppointments from "./features/users/MyAppointments";
import DoctorLayout from "./routes/DoctorLayout";
import DoctorDashboardHome from "./features/doctor/DoctorDashboardHome";
import DoctorUserList from "./features/doctor/DoctorUserList";
import EditDoctorDetail from "./features/doctor/EditDoctorDetail";
import AdminLayout from "./routes/AdminLayout";
import AdminHome from "./features/admin/AdminHome";
import AdminAppointments from "./features/admin/AdminAppointments";
import AdminAddDoctor from "./features/admin/AdminAddDoctor";
import AdminDoctorList from "./features/admin/AdminDoctorList";
import DoctorDetailPage from "./features/doctors/DoctorDetailPage";
import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./routes/ProtectedRoutes";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser } = useSelector((state) => state.auth);

  // ----------------------------------------------------
  // 1) Load logged-in user from localStorage on refresh
  // ----------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setLoggedInUser(parsedUser));

      // Fetch latest user from backend
      dispatch(fetchLoggedInUserAsync());

      // Fetch Profile (Fix navbar image issue)
      if (["user", "patient"].includes(parsedUser.role)) {
        dispatch(fetchMyProfileAsync());
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("loggedInUser");
    }
  }, [dispatch]);

  // ----------------------------------------------------
  // 2) Whenever loggedInUser changes, fetch fresh profile
  // ----------------------------------------------------
  useEffect(() => {
    if (!loggedInUser) return;

    dispatch(fetchLoggedInUserAsync());

    if (["user", "patient"].includes(loggedInUser.role)) {
      dispatch(fetchMyProfileAsync());
    }
  }, [loggedInUser, dispatch]);

  // ----------------------------------------------------
  // 3) Role-Based Redirect (after login)
  // ----------------------------------------------------
  useEffect(() => {
    if (!loggedInUser) return;

    if (["/", "/login"].includes(location.pathname)) {
      if (loggedInUser.role === "admin") navigate("/admin", { replace: true });
      else if (loggedInUser.role === "doctor")
        navigate("/doctor", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [loggedInUser, navigate, location.pathname]);

  // ----------------------------------------------------
  // 4) Choose Navbar by Role
  // ----------------------------------------------------
  const renderNavbar = () => {
    const role = loggedInUser?.role;

    switch (role) {
      case "admin":
        return <AdminNavList />;
      case "doctor":
        return <DoctorNavList />;
      case "user":
      case "patient":
        return <UserNavList />;
      default:
        return <GuestNavList />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Toaster position="top-right" />

      <header className="bg-white border-b border-stone-200 sticky top-0 z-[100]">
        {renderNavbar()}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<AllDoctors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/doctor/:id" element={<DoctorDetailPage />} />

          {/* USER ROUTES */}
          <Route
            element={<ProtectedRoute allowedRoles={["user", "patient"]} />}
          >
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
          </Route>

          {/* DOCTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<DoctorDashboardHome />} />
              <Route path="user-list" element={<DoctorUserList />} />
              <Route path="edit-details" element={<EditDoctorDetail />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="add-doctor" element={<AdminAddDoctor />} />
              <Route path="doctor-list" element={<AdminDoctorList />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
