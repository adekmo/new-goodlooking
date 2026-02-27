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
    <div>
      <h1>Edit Stylist</h1>

      <form
        action={`/api/admin/stylist/${stylist.id}`}
        method="POST"
      >
        <input type="hidden" name="_method" value="PATCH" />

        <div>
          <label>Name</label>
          <input name="name" defaultValue={stylist.name} required />
        </div>

        <div>
          <label>Specialization</label>
          <input
            name="specialization"
            defaultValue={stylist.specialization}
            required
          />
        </div>

        <div>
          <label>Experience</label>
          <input
            name="experience"
            type="number"
            defaultValue={stylist.experience}
            required
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default EditStylistPage