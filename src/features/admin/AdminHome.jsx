// src/pages/admin/AdminHome.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DoctorIcon from "../../assets/icon/doctor_icon.svg";
import AppointmentIcon from "../../assets/icon/appointments_icon.svg";
import MoneyIcon from "../../assets/icon/money.svg";
import ListIcon from "../../assets/icon/list_icon.svg";
import DefaultImage from "../../assets/default.png";

import StatCard from "../../components/common/StatCard";
import SectionHeader from "../../components/common/SectionHeader";
import AppointmentRow from "../../components/common/AppointmentRow";

import { fetchAllUsersAsync } from "../../redux/slices/userSlice";
import { fetchDoctorsAsync } from "../../redux/slices/doctorSlice";
import {
  fetchAllAppointmentsAsync,
  updateBookingAsync,
} from "../../redux/slices/bookingSlice";

function AdminHome() {
  const dispatch = useDispatch();

  const { doctors = [] } = useSelector((state) => state.doctor);
  const { bookings = [] } = useSelector((state) => state.booking);
  const { loggedInUser } = useSelector((state) => state.auth);

  // Fetch all data on load
  useEffect(() => {
    dispatch(fetchAllUsersAsync());
    dispatch(fetchDoctorsAsync());
    dispatch(fetchAllAppointmentsAsync());
  }, [dispatch]);

  // Update appointment status
  const handleStatusChange = (id, newStatus) => {
    dispatch(updateBookingAsync({ id, data: { status: newStatus } }));
  };

  // Earnings (Completed or Paid)
  const totalEarnings = bookings.reduce((sum, b) => {
    if (b.paid || b.status === "Completed") {
      return sum + (b.fees || 0);
    }
    return sum;
  }, 0);

  // Latest Appointments
  const latestAppointments = bookings
    .slice()
    .sort(
      (a, b) =>
        new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)
    )
    .map((appt) => ({
      id: appt._id,
      doctorName: appt.doctor?.name || "Unknown Doctor",
      patientImage: appt.user?.image?.url || DefaultImage,
      userName: appt.user?.name || "Unknown Patient",
      date: appt.date || "N/A",
      time: appt.time || "N/A",
      status: appt.status || "Pending",
    }));

  const latestAppointmentsLimited = latestAppointments.slice(0, 5);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-800">
          Welcome back{loggedInUser?.name ? `, ${loggedInUser.name}` : ""} 👋
        </h2>
        <p className="text-stone-600 mt-1">
          Here’s an overview of your hospital system activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={DoctorIcon} count={doctors.length} label="Doctors" />
        <StatCard
          icon={AppointmentIcon}
          count={bookings.length}
          label="Appointments"
        />
        <StatCard
          icon={MoneyIcon}
          count={`₹ ${totalEarnings}`}
          label="Total Earnings"
        />
      </div>

      {/* Latest Appointments */}
      <div className="my-16 bg-white border border-stone-200 rounded-lg overflow-hidden">
        <SectionHeader icon={ListIcon} title="Latest Appointments" />

        <table className="min-w-full">
          <tbody>
            {latestAppointmentsLimited.length > 0 ? (
              latestAppointmentsLimited.map((item) => (
                <AppointmentRow
                  key={item.id}
                  id={item.id}
                  doctorName={item.doctorName}
                  userName={item.userName}
                  date={`${item.date} • ${item.time}`}
                  patientImage={item.patientImage}
                  status={item.status}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-stone-500 py-6">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {latestAppointments.length > 5 && (
          <div className="text-right p-4">
            <a
              href="/admin/appointments"
              className="text-blue-600 hover:underline font-medium"
            >
              View All Appointments
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
