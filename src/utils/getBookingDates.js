export function getBookingDates(days = 10) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i + 1); // start from tomorrow

    const dayNumber = currentDate.getDate();
    const dayName = currentDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    dates.push({
      fullDate: currentDate.toISOString().split("T")[0], // YYYY-MM-DD
      date: dayNumber,
      dayName,
    });
  }

  return dates;
}
