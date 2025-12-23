export function getTimeSlots(
  startHour = 8,
  endHour = 13,
  intervalMinutes = 30
) {
  const slots = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMin = min.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMin}`);
    }
  }

  // Include exact endHour:00
  slots.push(`${endHour.toString().padStart(2, "0")}:00`);

  return slots;
}
