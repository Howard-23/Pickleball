export function combineDateAndTime(date: string, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(`${date}T00:00:00`);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function buildSlots(date: string, openTime = "08:00", closeTime = "22:00") {
  const slots: { start: Date; end: Date; label: string; endLabel: string }[] = [];
  const cursor = combineDateAndTime(date, openTime);
  const close = combineDateAndTime(date, closeTime);

  while (cursor < close) {
    const end = new Date(cursor);
    end.setHours(end.getHours() + 1);
    if (end > close) break;
    slots.push({
      start: new Date(cursor),
      end,
      label: cursor.toTimeString().slice(0, 5),
      endLabel: end.toTimeString().slice(0, 5),
    });
    cursor.setHours(cursor.getHours() + 1);
  }

  return slots;
}

export function isWithinOperatingHours(start: Date, end: Date, openTime: string, closeTime: string) {
  const day = start.toISOString().slice(0, 10);
  const open = combineDateAndTime(day, openTime);
  const close = combineDateAndTime(day, closeTime);
  return start >= open && end <= close && end > start;
}
