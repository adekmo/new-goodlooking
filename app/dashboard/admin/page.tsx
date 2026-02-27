import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import {prisma} from "@/lib/prisma"
import { Role } from "@prisma/client"

const AdminPage = async () => {

    const session = await getServerSession(authOptions)

    // Proteksi Role
    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/")
    }

    // Ambil data admin + salon miliknya
    const admin = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { salon: true }
    })

    // Jika admin belum punya salon
    if (!admin?.salon) {
        return (
        <div className="p-6">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="mt-4 text-red-500">
            Kamu belum ditugaskan ke salon manapun.
            </p>
        </div>
        )
    }

    const salon = admin.salon
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 border p-4 rounded-lg">
        <h2 className="text-lg font-semibold">{salon.name}</h2>
        <p>{salon.address}</p>
        <p>{salon.phone}</p>
        <p>
          Jam Operasional: {salon.openTime} - {salon.closeTime}
        </p>
      </div>
    </div>
  )
}

export default AdminPage