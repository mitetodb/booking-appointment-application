export function generateDailySlots(day, schedule, slotMinutes = 20) {
  const dayOfWeek = day.getDay(); // Sunday = 0
  const match = schedule.find(s => s.dayOfWeek === dayOfWeek);
  if (!match) return [];

  const [startH, startM] = match.startTime.split(':').map(Number);
  const [endH, endM] = match.endTime.split(':').map(Number);

  const slots = [];
  let current = new Date(day);
  current.setHours(startH, startM, 0, 0);

  const end = new Date(day);
  end.setHours(endH, endM, 0, 0);

  while (current < end) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + slotMinutes * 60 * 1000);
  }

  return slots;
}
