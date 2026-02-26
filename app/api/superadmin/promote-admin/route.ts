import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== Role.SUPERADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const userId = formData.get("userId") as string;
  const salonId = formData.get("salonId") as string;

  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
  });

  if (!salon) {
    return NextResponse.json({ error: "Salon not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: Role.ADMIN,
      salonId,
    },
  });

  return NextResponse.redirect(
    new URL("/dashboard/superadmin/users", req.url)
  );
}