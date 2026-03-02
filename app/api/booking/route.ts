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