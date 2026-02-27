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
    <div>
      <h1>Edit Service</h1>

      <form action={`/api/admin/service/${service.id}`} method="POST">
        <div>
          <label>Name</label>
          <input name="name" defaultValue={service.name} required />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" defaultValue={service.description} />
        </div>

        <div>
          <label>Price</label>
          <input name="price" type="number" defaultValue={service.price} />
        </div>

        <div>
          <label>Duration</label>
          <input
            name="duration"
            type="number"
            defaultValue={service.duration}
          />
        </div>

        <div>
          <label>Category</label>
          <input name="category" defaultValue={service.category} />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default EditServicePage