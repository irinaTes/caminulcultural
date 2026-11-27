/**
 * Seats still free: the session's own limit, else the workshop's, minus what
 * bookings hold (waiting or confirmed). null when neither has a limit.
 */
export function seatsLeft(
  capacity: number | null,
  workshopCapacity: number | null,
  taken: number,
) {
  const total = capacity ?? workshopCapacity;
  return total == null ? null : Math.max(0, total - taken);
}
