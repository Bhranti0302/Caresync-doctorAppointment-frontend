import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  setDoctor,
  addBookingAsync,
  fetchDoctorAvailableSlotsAsync,
} from "../../redux/slices/bookingSlice";
import { fetchDoctorByIdAsync } from "../../redux/slices/doctorSlice";
import { getBookingDates } from "../../utils/getBookingDates";
import { getTimeSlots } from "../../utils/getTimeSlots";
import BackButton from "../../components/common/Button/BackButton";
import defaultImage from "../../assets/default.png";

function DoctorDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redux states
  const { doctors, loading: doctorLoading } = useSelector(
    (state) => state.doctor
  );
  const {
    bookings,
    doctorSlots,
    loading: bookingLoading,
  } = useSelector((state) => state.booking);
  const { loggedInUser } = useSelector((state) => state.auth);

  // Local UI states
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [doctorInfo, setDoctorInfo] = useState(null);

  const bookingDates = getBookingDates(10);
  const timeSlots = getTimeSlots();

  // Fetch doctor details
  useEffect(() => {
    const existingDoctor = doctors.find((d) => d._id === id);
    if (existingDoctor) {
      setDoctorInfo(existingDoctor);
    } else {
      dispatch(fetchDoctorByIdAsync(id))
        .unwrap()
        .then((doc) => setDoctorInfo(doc))
        .catch(() => toast.error("Doctor details not found"));
    }
  }, [id, doctors, dispatch]);

  // Fetch booked slots
  useEffect(() => {
    if (doctorInfo?._id) {
      dispatch(setDoctor(doctorInfo._id));
      dispatch(fetchDoctorAvailableSlotsAsync(doctorInfo._id));
    }
  }, [doctorInfo, dispatch]);

  const isAvailable = doctorInfo?.available ?? true;

  // Normalize booked slots
  const bookedSlots = doctorSlots.map((slot) => ({
    date: slot.date,
    time: slot.time,
  }));

  // Check if all time slots for a date are booked
  const isDateFullyBooked = (date) => {
    const slotsForDate = bookedSlots.filter((slot) => slot.date === date);
    return slotsForDate.length >= timeSlots.length;
  };

  // Check if a specific time slot is booked for selected date
  const isTimeBooked = (time) =>
    bookedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === time
    );

  const handleBooking = async () => {
    if (!loggedInUser) {
      toast.error("Please login to book an appointment");
      return navigate("/login");
    }
    if (!selectedDate || !selectedTime || !reason.trim()) {
      return toast.error("All fields are required");
    }

    const alreadyBooked = bookings?.some(
      (appt) =>
        appt.doctor?._id === doctorInfo._id &&
        !appt.cancelled &&
        appt.date === selectedDate &&
        appt.time === selectedTime
    );
    if (alreadyBooked)
      return toast.error("You already have an appointment at this slot");

    const appointmentData = {
      doctor: doctorInfo._id,
      date: selectedDate,
      time: selectedTime,
      reason: reason.trim(),
      fees: doctorInfo.fees,
    };

    const resultAction = await dispatch(addBookingAsync(appointmentData));

    if (addBookingAsync.fulfilled.match(resultAction)) {
      setSelectedDate("");
      setSelectedTime("");
      setReason("");
      toast.success("Appointment booked successfully!");
      navigate("/my-appointments");
    } else {
      toast.error(resultAction.payload || "Booking failed");
    }
  };

  if (doctorLoading && !doctorInfo)
    return (
      <div className="flex justify-center items-center min-h-screen animate-pulse text-blue-600 font-medium">
        Loading doctor details...
      </div>
    );

  if (!doctorInfo)
    return (
      <div className="text-center mt-20 text-red-500">Doctor not found.</div>
    );

  return (
    <div className="mx-4 sm:mx-8 md:mx-10 my-10 max-w-7xl lg:mx-auto">
      <BackButton buttonName="Back to Doctors" />

      {/* Doctor Info */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="w-full lg:w-1/3 bg-blue-50 rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
          <img
            src={doctorInfo.image || defaultImage}
            alt={doctorInfo.name}
            className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 border border-stone-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 flex items-center gap-3">
              {doctorInfo.name}
              <i className="ri-checkbox-circle-fill text-blue-500 text-2xl"></i>
            </h1>
            <p className="text-lg text-stone-500 font-medium">
              {doctorInfo.degree} - {doctorInfo.speciality}
            </p>
            <span className="bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full w-fit mt-1">
              {doctorInfo.experience} Years Experience
            </span>
          </div>

          <div className="mt-8">
            <h6 className="text-stone-800 font-bold flex items-center gap-2 mb-2">
              About <i className="ri-information-line text-blue-500"></i>
            </h6>
            <p className="text-stone-600 leading-relaxed max-w-2xl">
              {doctorInfo.about}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-10">
            <div>
              <p className="text-stone-400 text-sm font-bold uppercase tracking-wider">
                Fee
              </p>
              <p className="text-2xl font-bold text-stone-800">
                ${doctorInfo.fees}
              </p>
            </div>
            <div>
              <p className="text-stone-400 text-sm font-bold uppercase tracking-wider">
                Location
              </p>
              <p className="text-stone-800 font-medium">
                {doctorInfo.address?.line1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="mt-12 bg-white rounded-2xl p-6 md:p-10 border border-stone-100 shadow-sm">
        <h4 className="text-2xl font-bold text-stone-800 mb-6">
          Schedule an Appointment
        </h4>

        {!isAvailable && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium flex items-center gap-2">
            <i className="ri-error-warning-line"></i> This doctor is currently
            not accepting new appointments.
          </div>
        )}

        <div className={!isAvailable ? "opacity-40 pointer-events-none" : ""}>
          {/* Date Selector */}
          <p className="text-stone-500 font-bold text-sm uppercase tracking-widest mb-4">
            Select Date
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {bookingDates.map((d, idx) => {
              const disabled = isDateFullyBooked(d.fullDate);
              return (
                <div
                  key={idx}
                  onClick={() => !disabled && setSelectedDate(d.fullDate)}
                  className={`flex-shrink-0 w-20 py-6 rounded-2xl border-2 text-center cursor-pointer ${
                    selectedDate === d.fullDate
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105"
                      : disabled
                      ? "bg-stone-200 border-stone-200 text-stone-400 cursor-not-allowed"
                      : "border-stone-100 text-stone-500 hover:border-blue-200"
                  }`}
                >
                  <p className="text-xs font-bold uppercase">{d.dayName}</p>
                  <p className="text-xl font-bold">{d.date}</p>
                </div>
              );
            })}
          </div>

          {/* Time Selector */}
          <p className="text-stone-500 font-bold text-sm uppercase tracking-widest mt-8 mb-4">
            Select Time
          </p>
          {selectedDate ? (
            <div className="flex flex-wrap gap-3">
              {timeSlots.map((t, idx) => {
                const disabled = isTimeBooked(t);
                return (
                  <button
                    key={idx}
                    onClick={() => !disabled && setSelectedTime(t)}
                    disabled={disabled}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                      selectedTime === t
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : disabled
                        ? "bg-stone-200 border-stone-200 text-stone-400 cursor-not-allowed"
                        : "border-stone-100 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-stone-400 italic">Please select a date first</p>
          )}

          {/* Reason Field */}
          <div className="mt-10 max-w-2xl">
            <label className="text-stone-800 font-bold block mb-2">
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your concern..."
              className="w-full border-2 border-stone-100 rounded-2xl p-4 focus:border-blue-500 focus:outline-none transition-colors min-h-[120px] resize-none"
            />
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="mt-10 bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none active:scale-95"
          >
            {bookingLoading ? "Processing..." : "Confirm Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetailPage;
