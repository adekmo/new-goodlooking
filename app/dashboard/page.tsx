import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === Role.SUPERADMIN) {
    redirect("/dashboard/superadmin/salons");
  }

  if (session.user.role === Role.ADMIN) {
    redirect("/dashboard/admin");
  }

  redirect("/");
}