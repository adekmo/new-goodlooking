import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import {prisma} from "@/lib/prisma"
import { Role } from "@prisma/client"

const UsersPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== Role.SUPERADMIN) {
        redirect("/")
    }

    const users = await prisma.user.findMany({
        include: { salon: true }
    })

    const salons = await prisma.salon.findMany()
  return (
    <div>
  <h1>User Management</h1>

  {users.map((user) => (
    <div
      key={user.id}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "12px",
      }}
    >
      <p>
        <strong>{user.name}</strong> - {user.role}
      </p>

      {/* SUPERADMIN */}
      {user.role === "SUPERADMIN" && (
        <p style={{ color: "gray" }}>No action available</p>
      )}

      {/* CUSTOMER → Promote */}
      {user.role === "CUSTOMER" && (
        <form action="/api/superadmin/promote-admin" method="POST">
          <input type="hidden" name="userId" value={user.id} />

          <select name="salonId" required>
            <option value="">Select Salon</option>
            {salons.map((salon) => (
              <option key={salon.id} value={salon.id}>
                {salon.name}
              </option>
            ))}
          </select>

          <button type="submit" style={{ marginLeft: "8px" }}>
            Promote to Admin
          </button>
        </form>
      )}

      {/* ADMIN → Show salon + Demote */}
      {user.role === "ADMIN" && (
        <div>
          <p>
            Salon:{" "}
            <strong>
              {user.salon ? user.salon.name : "Not Assigned"}
            </strong>
          </p>

          <form action="/api/superadmin/demote-admin" method="POST">
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" style={{ marginTop: "6px" }}>
              Demote to Customer
            </button>
          </form>
        </div>
      )}
    </div>
  ))}
</div>
  )
}

export default UsersPage