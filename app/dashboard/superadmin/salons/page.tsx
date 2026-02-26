import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SalonType } from "@/types/salon";
import CreateSalonForm from "./_components/CreateSalonForm";
import DeleteSalonButton from "./_components/DeleteSalonButton";
import EditSalonForm from "./_components/EditSalonForm";


const SuperadminSalonsPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.SUPERADMIN) {
        redirect("/dashboard");
    }

    const salons = await prisma.salon.findMany({
        orderBy: { createdAt: "desc" },
    });

    const typedSalons: SalonType[] = salons.map((salon) => ({
        ...salon,
        createdAt: salon.createdAt.toISOString(),
    }));
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Manage Salons</h1>

      <CreateSalonForm />

      <div className="space-y-4">
        {typedSalons.map((salon) => (
          <div
            key={salon.id}
            className="border p-4 rounded-lg shadow-sm"
          >
            <h2 className="font-semibold text-lg">{salon.name}</h2>
            <p>{salon.address}</p>
            <p>{salon.phone}</p>
            <p>
              {salon.openTime} - {salon.closeTime}
            </p>
            <EditSalonForm salon={salon} />
            <DeleteSalonButton salonId={salon.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuperadminSalonsPage