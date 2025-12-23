function CancelAppointmentButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-md text-white font-medium transition ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      ✕
    </button>
  );
}

export default CancelAppointmentButton;
