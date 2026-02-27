import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CreateServicePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  return (
    <div>
      <h1>Create Service</h1>

      <form action="/api/admin/service" method="POST">
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" required />
        </div>

        <div>
          <label>Price</label>
          <input name="price" type="number" required />
        </div>

        <div>
          <label>Duration (minutes)</label>
          <input name="duration" type="number" required />
        </div>

        <div>
          <label>Category</label>
          <input name="category" required />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateServicePage