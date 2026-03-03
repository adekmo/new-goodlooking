import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";


const DashboardLayout = async ({children,}: { children: React.ReactNode; }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

  return (
    <DashboardShell session={session}>
      {children}
    </DashboardShell>
  )
}

export default DashboardLayout