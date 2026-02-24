import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.SUPERADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const salons = await prisma.salon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(salons);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.SUPERADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    name,
    address,
    phone,
    description,
    image,
    openTime,
    closeTime,
  }: {
    name: string;
    address: string;
    phone: string;
    description: string;
    image?: string;
    openTime: string;
    closeTime: string;
  } = body;

  if (!name || !address || !phone || !description || !openTime || !closeTime) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const salon = await prisma.salon.create({
    data: {
      name,
      address,
      phone,
      description,
      image,
      openTime,
      closeTime,
    },
  });

  return NextResponse.json(salon, { status: 201 });
}