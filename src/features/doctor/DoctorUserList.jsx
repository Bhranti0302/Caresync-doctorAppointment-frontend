// src/pages/doctor/DoctorUserList.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "../../components/common/Table";
import CancelAppointmentButton from "../../components/common/Button/CancelAppointmentButton";
import CompleteButton from "../../components/common/Button/CompleteAppointmentButton";
import DefaultImage from "../../assets/default.png";
import { fetchDoctorsAsync } from "../../redux/slices/doctorSlice";
import { fetchBookingsByDoctorId } from "../../redux/slices/bookingSlice";

function DoctorUserList() {
  const dispatch = useDispatch();
  const { doctors = [], loading } = useSelector((state) => state.doctor);
  const { bookings: appointments = [] } = useSelector((state) => state.booking || {});
  const { loggedInUser } = useSelector((state) => state.auth || {});
  const [localAppointments, setLocalAppointments] = useState(appointments);

  // Fetch doctors
  useEffect(() => {
    dispatch(fetchDoctorsAsync());
  }, [dispatch]);

  // Sync local state with Redux
  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  // Fetch this doctor's appointments
  useEffect(() => {
    if (loggedInUser?._id && loggedInUser.role === "doctor") {
      dispatch(fetchBookingsByDoctorId(loggedInUser._id));
    }
  }, [dispatch, loggedInUser]);

  // Identify logged-in doctor
  const loggedDoctor =
    loggedInUser?.role === "doctor"
      ? doctors.find(
          (doc) =>
            doc._id === loggedInUser._id ||
            doc._id === loggedInUser.id ||
            doc.email === loggedInUser.email ||
            doc.name === loggedInUser.name
        ) || loggedInUser
      : null;

  // Filter doctor's appointments
  const doctorAppointments =
    localAppointments?.filter(
      (appt) =>
        appt?.doctor?._id === loggedDoctor?._id ||
        appt.doctorId === loggedDoctor?._id
    ) || [];

  const handleStatusChange = (id, status) => {
    setLocalAppointments((prev) =>
      prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
    );
    // Optionally dispatch an async thunk to update backend
  };

  const columns = [
    { key: "patient", label: "Patient" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  if (loading)
    return <p className="text-center text-stone-500 mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h5 className="text-xl font-semibold mb-6">
        {loggedDoctor
          ? `Appointments for ${loggedDoctor.name}`
          : "Appointments"}
      </h5>

      {doctorAppointments.length > 0 ? (
        <Table
          columns={columns}
          data={doctorAppointments}
          renderCell={(col, row) => {
            // Patient Column
            if (col.key === "patient") {
              return (
                <div className="flex items-center gap-2">
                  <img
                    src={
                      row.user?.image?.url ||
                      row.user?.image?.secure_url ||
                      row.user?.image?.path ||
                      row.user?.image ||
                      DefaultImage
                    }
                    alt={row.user?.name || "Patient"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{row.user?.name || "Unknown"}</span>
                </div>
              );
            }

            // Status Column
            if (col.key === "status") {
              return (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    row.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : row.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.status || "Pending"}
                </span>
              );
            }

            // Action Column
            if (col.key === "action") {
              const isDisabled =
                row.status === "Completed" || row.status === "Cancelled";
              return (
                <div className="flex justify-center gap-2">
                  <CompleteButton
                    onClick={() => handleStatusChange(row._id, "Completed")}
                    disabled={isDisabled}
                  />
                  <CancelAppointmentButton
                    onClick={() => handleStatusChange(row._id, "Cancelled")}
                    disabled={isDisabled}
                  />
                </div>
              );
            }

            return row[col.key];
          }}
        />
      ) : (
        <p className="text-center text-stone-500 mt-10">
          No appointments found
        </p>
      )}
    </div>
  );
}

export default DoctorUserList;
