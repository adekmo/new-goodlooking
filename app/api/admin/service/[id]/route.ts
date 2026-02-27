import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const category = formData.get("category") as string;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service || service.salonId !== token.salonId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      price,
      duration,
      category,
    },
  });

  return NextResponse.redirect(
    new URL("/dashboard/admin/service", req.url)
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

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service || service.salonId !== token.salonId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.service.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}