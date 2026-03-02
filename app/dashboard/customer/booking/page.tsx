import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

const CustomerBookingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.CUSTOMER) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: session.user.id,
    },
    include: {
      salon: true,
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
      <h1>My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((booking) => (
        <div key={booking.id}>
          <p><strong>Salon:</strong> {booking.salon.name}</p>
          <p><strong>Stylist:</strong> {booking.stylist.name}</p>
          <p>{booking.date.toDateString()}</p>
          <p>{booking.startTime} - {booking.endTime}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  )
}

export default CustomerBookingPage