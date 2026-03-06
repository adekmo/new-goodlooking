type Booking = {
  startTime: string
  endTime: string
}

export function generateSlots(
  startTime: string,
  endTime: string,
  duration: number,
  bookings: Booking[]
) {

  const slots = []

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
  }

  const toTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`
  }

  let start = toMinutes(startTime)
  const end = toMinutes(endTime)

  while (start + duration <= end) {

    const slotStart = start
    const slotEnd = start + duration

    let available = true

    for (const booking of bookings) {

      const bStart = toMinutes(booking.startTime)
      const bEnd = toMinutes(booking.endTime)

      const overlap =
        slotStart < bEnd &&
        slotEnd > bStart

      if (overlap) {
        available = false
        break
      }
    }

    slots.push({
      time: toTime(slotStart),
      available
    })

    start += 30
  }

  return slots
}