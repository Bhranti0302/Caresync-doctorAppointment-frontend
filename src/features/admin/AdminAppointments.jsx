import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "../../components/common/Table";
import CancelAppointmentButton from "../../components/common/Button/CancelAppointmentButton";
import CompleteButton from "../../components/common/Button/CompleteAppointmentButton";
import DefaultImage from "../../assets/default.png";
import {
  fetchAllAppointmentsAsync,
  updateBookingAsync,
  deleteBookingAsync,
} from "../../redux/slices/bookingSlice";

function AdminAppointmentList() {
  const dispatch = useDispatch();

  const { bookings, loading } = useSelector((state) => state.booking);
  const doctors = useSelector((state) => state.doctor.doctors || []);
  const users = useSelector((state) => state.user.allUsers || []);

  useEffect(() => {
    dispatch(fetchAllAppointmentsAsync());
  }, [dispatch]);

  if (!loading && (!bookings?.length || !users?.length)) {
    return (
      <div className="p-4 text-center text-gray-500 text-lg">
        {!users?.length && bookings?.length ? (
          <>No users found.</>
        ) : !bookings?.length ? (
          <>No appointments found.</>
        ) : (
          <>No data available.</>
        )}
      </div>
    );
  }

  const mergedAppointments = bookings.map((appt, index) => {
    // Find doctor and user objects by ID
    const doctor =
      doctors.find((d) => d._id === (appt.doctor?._id || appt.doctor)) || {};
    const user =
      users.find((u) => u._id === (appt.user?._id || appt.user)) || {};

    return {
      id: appt._id,
      index: index + 1,
      patientName: user.name || appt.userName || "Unknown User",
      patientImage: user.image?.url || user.image || DefaultImage,
      age: user.age || "N/A",
      dateTime: `${appt.date || "N/A"} • ${appt.time || ""}`,
      doctorName: doctor.name || appt.doctorName || "Unknown Doctor",
      doctorImage: doctor.image?.url || doctor.image || DefaultImage,
      fees: appt.fees || doctor.fees || 0,
      status: appt.status || "Pending",
      paid: appt.paid || false,
    };
  });

  const columns = [
    { key: "index", label: "#" },
    { key: "patient", label: "Patient" },
    { key: "age", label: "Age" },
    { key: "dateTime", label: "Date & Time" },
    { key: "doctor", label: "Doctor" },
    { key: "fees", label: "Fees" },
    { key: "status", label: "Status" },
    { key: "paid", label: "Paid" },
    { key: "action", label: "Action" },
  ];

  const handleCancel = (id) => {
    dispatch(updateBookingAsync({ id, data: { status: "Cancelled" } }));
  };

  const handleComplete = (id) => {
    dispatch(updateBookingAsync({ id, data: { status: "Completed" } }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBookingAsync(id));
  };

  return (
    <div className="p-4">
      <h5 className="text-xl font-semibold mb-6">All Appointments</h5>

      <div className="overflow-x-auto">
        <Table
          className="min-w-[1000px]"
          columns={columns}
          data={mergedAppointments}
          renderCell={(col, row) => {
            if (col.key === "index") return row.index;

            if (col.key === "patient") {
              return (
                <div className="flex items-center gap-2">
                  <img
                    src={row.patientImage}
                    alt="Patient"
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{row.patientName}</span>
                </div>
              );
            }

            if (col.key === "doctor") {
              return (
                <div className="flex items-center gap-2">
                  <img
                    src={row.doctorImage}
                    alt="Doctor"
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{row.doctorName}</span>
                </div>
              );
            }

            if (col.key === "status") {
              const color =
                row.status === "Completed"
                  ? "text-green-600"
                  : row.status === "Cancelled"
                  ? "text-red-500"
                  : "text-yellow-600";
              return (
                <span className={`font-semibold ${color}`}>{row.status}</span>
              );
            }

            if (col.key === "paid") {
              return (
                <span
                  className={`font-semibold ${
                    row.paid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {row.paid ? "Yes" : "No"}
                </span>
              );
            }

            if (col.key === "action") {
              const isDisabled =
                row.status === "Completed" || row.status === "Cancelled";

              return (
                <div className="flex justify-center gap-2">
                  <CompleteButton
                    onClick={() => handleComplete(row.id)}
                    disabled={isDisabled}
                  />
                  <CancelAppointmentButton
                    onClick={() => handleCancel(row.id)}
                    disabled={isDisabled}
                  />
                </div>
              );
            }

            return row[col.key];
          }}
        />
      </div>
    </div>
  );
}

export default AdminAppointmentList;
