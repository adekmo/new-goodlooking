import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";


const AdminBookingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      salonId: session.user.salonId!,
    },
    include: {
      customer: true,
      stylist: true,
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return (
    <div>
      <h1>Booking List</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Customer:</strong> {booking.customer.name}</p>
          <p><strong>Stylist:</strong> {booking.stylist.name}</p>
          <p><strong>Date:</strong> {booking.date.toDateString()}</p>
          <p>
            <strong>Time:</strong> {booking.startTime} - {booking.endTime}
          </p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Total:</strong> Rp {booking.totalPrice}</p>

          <p><strong>Services:</strong></p>
          <ul>
            {booking.services.map((bs) => (
              <li key={bs.id}>{bs.service.name}</li>
            ))}
          </ul>
          {booking.status === "PENDING" && (
            <div>
                <form action={`/api/booking/${booking.id}/confirm`} method="POST">
                <button type="submit">Confirm</button>
                </form>

                <form action={`/api/booking/${booking.id}/cancel`} method="POST">
                <button type="submit">Cancel</button>
                </form>
            </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default AdminBookingPage