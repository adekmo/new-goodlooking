import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

type AvailabilityInput = {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: AvailabilityInput[] = await req.json();

  await prisma.stylistAvailability.deleteMany({
    where: { stylistId: id },
  });

  await prisma.stylistAvailability.createMany({
    data: data.map((d) => ({
      stylistId: id,
      dayOfWeek: d.dayOfWeek,
      startTime: d.startTime,
      endTime: d.endTime,
    })),
  });

  return NextResponse.json({ success: true });
}