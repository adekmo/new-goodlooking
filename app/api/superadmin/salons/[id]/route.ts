import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.SUPERADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      name,
      address,
      phone,
      description,
      image,
      openTime,
      closeTime,
    } = body;

    const updatedSalon = await prisma.salon.update({
      where: { id },
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

    return NextResponse.json(updatedSalon);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to update salon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.SUPERADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.salon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Salon deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete salon" },
      { status: 500 }
    );
  }
}