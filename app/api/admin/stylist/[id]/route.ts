import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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

  if (!token.salonId) {
    return NextResponse.json({ error: "No salon assigned" }, { status: 400 });
  }

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const experience = Number(formData.get("experience"));

  const stylist = await prisma.stylist.findUnique({
    where: { id },
  });

  if (!stylist || stylist.salonId !== token.salonId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.stylist.update({
    where: { id },
    data: {
      name,
      specialization,
      experience,
    },
  });

  return NextResponse.redirect(
    new URL("/dashboard/admin/stylist", req.url)
  );
}

export async function DELETE(
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

  if (!token.salonId) {
    return NextResponse.json({ error: "No salon assigned" }, { status: 400 });
  }

  const stylist = await prisma.stylist.findUnique({
    where: { id },
  });

  if (!stylist || stylist.salonId !== token.salonId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.stylist.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}