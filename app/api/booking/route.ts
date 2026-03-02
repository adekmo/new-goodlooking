import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== Role.CUSTOMER) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();

  const salonId = formData.get("salonId") as string;
  const stylistId = formData.get("stylistId") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;

  const services = formData.getAll("services") as string[];

  if (!services.length) {
    return NextResponse.json(
      { error: "Select at least one service" },
      { status: 400 }
    );
  }

  const selectedServices = await prisma.service.findMany({
    where: {
      id: { in: services },
    },
  });

  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  // hitung endTime
  const [hour, minute] = startTime.split(":").map(Number);
  const startDate = new Date(date);
  startDate.setHours(hour, minute);

  const endDate = new Date(startDate.getTime() + totalDuration * 60000);

  const endTime = endDate.toTimeString().slice(0, 5);

  function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
  });

  if (!salon) {
    return NextResponse.json({ error: "Salon not found" }, { status: 404 });
  }

  const openMinutes = toMinutes(salon.openTime);
  const closeMinutes = toMinutes(salon.closeTime);
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    return NextResponse.json(
      { error: "Booking outside salon working hours" },
      { status: 400 }
    );
  }

  // Cek bentrok stylist
  const existingBooking = await prisma.booking.findFirst({
    where: {
      stylistId,
      date: {
        gte: new Date(date + "T00:00:00"),
        lt: new Date(date + "T23:59:59"),
      },
      OR: [
        {
          startTime: {
            lt: endTime,
          },
          endTime: {
            gt: startTime,
          },
        },
      ],
      status: {
        not: "CANCELLED",
      },
    },
  });

  if (existingBooking) {
    return NextResponse.json(
      { error: "Stylist already booked at that time" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: token.sub!,
      salonId,
      stylistId,
      date: startDate,
      startTime,
      endTime,
      totalPrice,
      totalDuration,
      status: "PENDING",
      services: {
        create: services.map((serviceId) => ({
          serviceId,
        })),
      },
    },
  });

  return NextResponse.redirect(
    new URL(`/salon/${salonId}`, req.url)
  );
}