import EditStylistForm from "@/components/EditStylistForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";




const EditStylistPage = async ({ params,}: { params: Promise<{ id: string }>; }) => {

    const session = await getServerSession(authOptions);
    const { id } = await params;

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const stylist = await prisma.stylist.findUnique({
    where: { id },
  });

  if (!stylist) {
    redirect("/dashboard/admin/stylist");
  }
  return (
    <div className="p-6 max-w-xl">
      <EditStylistForm stylist={stylist} />
    </div>
  )
}

export default EditStylistPage