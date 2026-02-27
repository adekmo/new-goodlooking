import DeleteStylistButton from "@/components/DeleteStylistButton";
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";


const StylistPage = async () => {

    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!admin?.salonId) {
        return <div>Kamu belum memiliki salon.</div>;
    }

    const stylists = await prisma.stylist.findMany({
        where: { salonId: admin.salonId },
    });
  return (
    <div>
      <h1>Stylists</h1>

      <a href="/dashboard/admin/stylist/create">
        + Add Stylist
      </a>

      {stylists.map((stylist) => (
        <div key={stylist.id} style={{ marginTop: "10px" }}>
          <p><strong>{stylist.name}</strong></p>
          <p>{stylist.specialization}</p>
          <p>{stylist.experience} years</p>
          <a href={`/dashboard/admin/stylist/${stylist.id}/edit`}>
            Edit
          </a>
          <DeleteStylistButton id={stylist.id} />
        
        </div>
      ))}
    </div>
  )
}

export default StylistPage