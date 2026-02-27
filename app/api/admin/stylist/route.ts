import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || token.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const experience = Number(formData.get("experience"));

  if (!token.salonId) {
    return NextResponse.json({ error: "No salon assigned" }, { status: 400 });
  }

  await prisma.stylist.create({
    data: {
      name,
      specialization,
      experience,
      salonId: token.salonId,
    },
  });

  return NextResponse.redirect(
    new URL("/dashboard/admin/stylist", req.url)
  );
}