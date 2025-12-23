// src/pages/doctor/DoctorDashboardHome.jsx
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppointmentIcon from "../../assets/icon/appointments_icon.svg";
import ListIcon from "../../assets/icon/list_icon.svg";
import MoneyIcon from "../../assets/icon/money.svg";
import DefaultImage from "../../assets/default.png";

import StatCard from "../../components/common/StatCard";
import SectionHeader from "../../components/common/SectionHeader";
import AppointmentRow from "../../components/common/AppointmentRow";

import {
  fetchBookingsByDoctorId,
  updateBookingAsync,
} from "../../redux/slices/bookingSlice";

function DoctorDashboardHome() {
  const dispatch = useDispatch();

  // Get logged doctor info
  const { loggedInUser } = useSelector((state) => state.auth);
  

  // Get bookings from booking slice
  const {
    bookings = [],
    loading,
    error,
  } = useSelector((state) => state.booking);


  // Fetch appointments for logged doctor
  useEffect(() => {
    if (loggedInUser?._id) {
      
      dispatch(fetchBookingsByDoctorId(loggedInUser._id));
    } else {
      console.log("❌ No doctor ID found");
    }
  }, [loggedInUser, dispatch]);

  // ------- STATS -------
  const totalAppointments = bookings.length;

  const totalFees = useMemo(() => {
    return bookings.reduce((sum, appt) => sum + (appt.fees || 0), 0);
  }, [bookings]);

  // ------- Latest Appointments -------
  const latestAppointments = bookings
    .slice()
    .sort(
      (a, b) =>
        new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)
    )
    .map((appt) => ({
      id: appt._id,
      userName: appt.user?.name || appt.patient?.name || "Unknown Patient",
      patientImage:
        appt.user?.image?.url || appt.patient?.image || DefaultImage,
      date: appt.date || "N/A",
      time: appt.time || "N/A",
      status: appt.status || "Pending",
      fees: appt.fees || 0,
    }));

  const latestAppointmentsLimited = latestAppointments.slice(0, 5);

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-yellow-600";
  };

  // Handle status update
  const handleStatusChange = (id, newStatus) => {
    dispatch(updateBookingAsync({ id, data: { status: newStatus } }));
  };


  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-800">
          Welcome back{loggedInUser?.name ? `, ${loggedInUser.name}` : ""} 👋
        </h2>
        <p className="text-stone-600 mt-1">
          Here’s an overview of your appointments & earnings.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={AppointmentIcon}
          count={totalAppointments}
          label="Total Appointments"
        />
        <StatCard
          icon={MoneyIcon}
          count={`₹ ${totalFees}`}
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
                  doctorName={loggedInUser?.name}
                  userName={item.userName}
                  date={`${item.date} • ${item.time}`}
                  patientImage={item.patientImage}
                  status={item.status}
                  statusClass={getStatusColor(item.status)}
                  onStatusChange={(newStatus) =>
                    handleStatusChange(item.id, newStatus)
                  }
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
              href="/doctor/appointments"
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

export default DoctorDashboardHome;
