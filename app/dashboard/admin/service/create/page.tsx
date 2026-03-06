import CreateServiceForm from "@/components/CreateServiceForm ";
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
    <div className="max-w-xl mx-auto">
      <CreateServiceForm />
    </div>
  )
}

export default CreateServicePage