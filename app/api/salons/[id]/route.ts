import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";
import {prisma} from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    token.role === Role.ADMIN &&
    token.salonId !== params.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const salon = await prisma.salon.findUnique({
    where: { id: params.id },
  });

  if (!salon) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(salon);
}