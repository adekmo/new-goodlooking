import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import AvailabilityForm from "@/components/AvailabilityForm";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const StylistAvailabilityPage  = async ({ params,}: { params: Promise<{ id: string }>; }) => {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const stylist = await prisma.stylist.findUnique({
    where: { id },
    include: {
      availability: true,
    },
  });

  if (!stylist) {
    redirect("/dashboard/admin/stylist");
  }
  return (
    <div className="p-6 space-y-6">
        <AvailabilityForm
            stylistId={stylist.id}
            availability={stylist.availability}
        />
    </div>
  )
}

export default StylistAvailabilityPage 