// src/pages/user/MyAppointments.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookingsAsync,
  deleteBookingAsync,
  clearBookingError,
} from "../../redux/slices/bookingSlice";
import DefaultDoctorImage from "../../assets/default.png";
import { useNavigate } from "react-router-dom";
import StripePayment from "../../components/common/Payment";
function MyAppointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookings, loading, error } = useSelector((state) => state.booking);
  const { loggedInUser } = useSelector((state) => state.auth);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments for logged-in user
  useEffect(() => {
    if (loggedInUser) dispatch(fetchBookingsAsync());
    return () => dispatch(clearBookingError());
  }, [dispatch, loggedInUser]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      dispatch(deleteBookingAsync(id));
    }
  };

  const handlePayment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // Close payment modal
  const closeModal = () => setSelectedAppointment(null);

  // ========================== UI STATES ==========================
  if (loading && bookings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-stone-500 font-medium text-lg">
          Loading your appointments...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="m-6 md:mx-10 md:my-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">
          Failed to load appointments: {error}
        </p>
        <button
          onClick={() => dispatch(fetchBookingsAsync())}
          className="mt-4 text-blue-600 underline font-semibold"
        >
          Try Again
        </button>
      </div>
    );

  if (!bookings || bookings.length === 0)
    return (
      <div className="m-6 md:mx-10 md:my-20 text-center py-20 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
        <i className="ri-calendar-event-line text-5xl text-stone-300"></i>
        <p className="mt-4 text-stone-600 text-lg font-medium">
          No appointments found.
        </p>
        <button
          onClick={() => navigate("/doctors")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Book an Appointment
        </button>
      </div>
    );

  return (
    <div className="m-6 md:mx-10 md:my-10 lg:my-20">
      <h4 className="text-3xl font-bold mb-8 text-stone-800 flex items-center gap-3">
        <i className="ri-bookmark-3-line text-blue-600"></i>
        My Appointments
      </h4>

      <div className="space-y-8 max-w-6xl">
        {bookings.map((item) => {
          const doctor = item.doctorData || item.doctor || {};
          let doctorImg = DefaultDoctorImage;
          if (doctor?.image) {
            doctorImg =
              typeof doctor.image === "string"
                ? doctor.image.startsWith("http")
                  ? doctor.image
                  : `${import.meta.env.VITE_API_URL}/${doctor.image}`
                : doctor.image.url;
          }

          return (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-white border border-stone-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
            >
              {/* Doctor Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
                <div className="bg-blue-50 rounded-xl overflow-hidden flex-shrink-0 border border-blue-100">
                  <img
                    src={doctorImg}
                    alt={doctor.name || "Doctor"}
                    className="w-full sm:w-40 h-48 object-cover"
                  />
                </div>

                <div className="flex-grow flex flex-col gap-3">
                  <div>
                    <h6 className="text-2xl font-bold text-stone-800">
                      {doctor.name || "Specialist"}
                    </h6>
                    <p className="text-blue-600 font-medium">
                      {doctor.speciality ||
                        doctor.specialization ||
                        "Medical Professional"}
                    </p>
                    <p className="text-stone-400 text-sm mt-1">
                      {doctor.degree || ""}
                    </p>
                  </div>

                  <div className="text-stone-600 text-sm">
                    <p className="font-semibold text-stone-700 flex items-center gap-2">
                      <i className="ri-map-pin-2-line text-blue-500"></i>{" "}
                      Address:
                    </p>
                    <p className="ml-6">
                      {doctor.address?.line1 || "Clinic Address Not Provided"}
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-lg flex items-center gap-3 border border-stone-100">
                    <i className="ri-calendar-check-line text-blue-600 text-xl"></i>
                    <div>
                      <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">
                        Scheduled For
                      </p>
                      <p className="text-stone-800 font-semibold">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        | <span className="text-blue-600">{item.time}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {/* ✔ Paid */}
                {item.paid === true && (
                  <p className="bg-green-100 text-green-700 border border-green-300 py-2.5 px-10 rounded-lg text-center font-semibold">
                    Payment Completed
                  </p>
                )}

                {/* 💳 Pay Now */}
                {item.paid === false && !item.cancelled && (
                  <button
                    onClick={() => handlePayment(item)}
                    className="bg-blue-600 text-white font-semibold py-2.5 px-10 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    <i className="ri-wallet-3-line"></i> Pay Now ₹{item.fees}
                  </button>
                )}

                {/* Cancel */}
                {!item.cancelled ? (
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={loading}
                    className="border border-stone-200 text-stone-600 py-2.5 px-10 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-circle-line"></i> Cancel
                  </button>
                ) : (
                  <button
                    disabled
                    className="border border-red-200 text-red-400 py-2.5 px-10 rounded-lg bg-red-50 font-medium cursor-not-allowed"
                  >
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn border border-gray-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h3 className="text-2xl font-semibold text-stone-800">
                Pay ₹{selectedAppointment.fees}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            {/* Stripe Payment Form */}
            <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <StripePayment
                appointmentId={selectedAppointment._id}
                fees={selectedAppointment.fees}
                closeModal={closeModal}
              />
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              All transactions are secure and encrypted. We do not store your
              card information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
