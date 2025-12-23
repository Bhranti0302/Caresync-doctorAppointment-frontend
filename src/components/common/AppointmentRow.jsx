// src/components/common/AppointmentRow.jsx

import CompleteAppointmentButton from "./Button/CompleteAppointmentButton";
import CancelAppointmentButton from "./Button/CancelAppointmentButton";
import DefaultImage from "../../assets/default.png";

function AppointmentRow({
  id,
  doctorName,
  userName,
  date,
  patientImage,
  status,
  onStatusChange,
}) {
  const isDisabled = status === "Completed" || status === "Cancelled";

  return (
    <tr className="border-b border-stone-300">
      {/* Patient & Doctor Info */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={patientImage || DefaultImage}
            alt={userName}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <h6 className="text-md font-semibold text-stone-800">
              Patient: {userName}
            </h6>
            <p className="text-sm text-stone-500">Doctor: {doctorName}</p>
            <p className="text-sm text-stone-400">Booking on {date}</p>
          </div>
        </div>
      </td>

      {/* Status + Action Buttons */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-4">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "Completed"
                ? "bg-green-100 text-green-700"
                : status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>

          {/* Buttons */}
          <div className="flex gap-2">
            <CompleteAppointmentButton
              onClick={() => onStatusChange(id, "Completed")}
              disabled={isDisabled}
            />

            <CancelAppointmentButton
              onClick={() => onStatusChange(id, "Cancelled")}
              disabled={isDisabled}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default AppointmentRow;
