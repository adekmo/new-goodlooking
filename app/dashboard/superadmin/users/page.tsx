import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PromoteForm from "@/components/PromoteForm";
import DemoteButton from "@/components/DemoteButton";


const UsersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.SUPERADMIN) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    include: { salon: true },
    orderBy: { createdAt: "desc" },
  });

  const salons = await prisma.salon.findMany();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage user roles and salon assignments.
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Salon</th>
                <th className="px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "SUPERADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* SALON */}
                  <td className="px-6 py-4">
                    {user.role === "ADMIN"
                      ? user.salon?.name || "Not Assigned"
                      : "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    {user.role === "SUPERADMIN" && (
                      <span className="text-gray-400 text-sm">
                        No action
                      </span>
                    )}

                    {user.role === "CUSTOMER" && (
                      <PromoteForm
                        userId={user.id}
                        salons={salons}
                      />
                    )}

                    {user.role === "ADMIN" && (
                      <DemoteButton userId={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;