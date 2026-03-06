import EditServiceForm from "@/components/EditServiceForm ";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const EditServicePage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const service = await prisma.service.findUnique({
        where: { id },
    });

    if (!service) {
        redirect("/dashboard/admin/service");
    }

  return (
    <div className="max-w-xl mx-auto">
      <EditServiceForm service={service} />
    </div>
  )
}

export default EditServicePage