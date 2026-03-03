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
    <div className="space-y-6">
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Manage Salons
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, edit and manage all registered salons.
        </p>
      </div>

      <CreateSalonForm />
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {typedSalons.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No salons found. Create your first salon 🚀
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="px-6 py-4 font-medium">Salon</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Hours</th>
              <th className="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {typedSalons.map((salon) => (
              <tr key={salon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold">
                    {salon.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {salon.address}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {salon.phone}
                </td>

                <td className="px-6 py-4">
                  {salon.openTime} - {salon.closeTime}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <EditSalonForm salon={salon} />
                  <DeleteSalonButton salonId={salon.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  )
}

export default SuperadminSalonsPage