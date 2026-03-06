import { prisma } from "@/lib/prisma"
import { generateSlots } from "@/lib/slotGenerator"
import { NextRequest, NextResponse } from "next/server"

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)

  const stylistId = searchParams.get("stylistId")
  const serviceIds = searchParams.get("serviceIds")
  const date = searchParams.get("date")

  if (!stylistId || !serviceIds || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  const services = await prisma.service.findMany({
    where: {
      id: {
        in: serviceIds.split(",")
      }
    }
  })

  const totalDuration = services.reduce(
    (sum, s) => sum + s.duration,
    0
  )

  const dayOfWeek = new Date(date).getDay()

  const availability = await prisma.stylistAvailability.findUnique({
    where: {
      stylistId_dayOfWeek: {
        stylistId,
        dayOfWeek,
      },
    },
  })

  if (!availability) {
    return NextResponse.json([])
  }

  const startOfDay = new Date(date)
  startOfDay.setHours(0,0,0,0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23,59,59,999)

  const bookingsRaw = await prisma.booking.findMany({
    where: {
        stylistId,
        date: {
        gte: startOfDay,
        lte: endOfDay,
        },
    },
    })

  const bookings = bookingsRaw

  const slots = generateSlots(
    availability.startTime,
    availability.endTime,
    totalDuration,
    bookings
  )

  return NextResponse.json(slots)
}