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

  if (!token.salonId) {
    return NextResponse.json({ error: "No salon assigned" }, { status: 400 });
  }

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const category = formData.get("category") as string;

  await prisma.service.create({
    data: {
      name,
      description,
      price,
      duration,
      category,
      salonId: token.salonId,
    },
  });

  return NextResponse.redirect(
    new URL("/dashboard/admin/service", req.url)
  );
}