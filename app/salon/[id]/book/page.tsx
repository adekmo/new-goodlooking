import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

const BookingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.CUSTOMER) {
    redirect("/");
  }

  const salon = await prisma.salon.findUnique({
    where: { id },
    include: {
      stylists: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!salon) {
    redirect("/salon");
  }

  return (
    <div>
      <h1>Book at {salon.name}</h1>

      <form action="/api/booking" method="POST">
        <input type="hidden" name="salonId" value={salon.id} />

        {/* Stylist */}
        <div>
          <label>Select Stylist</label>
          <select name="stylistId" required>
            <option value="">-- Choose Stylist --</option>
            {salon.stylists.map((stylist) => (
              <option key={stylist.id} value={stylist.id}>
                {stylist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Services */}
        <div>
          <label>Select Services</label>
          {salon.services.map((service) => (
            <div key={service.id}>
              <input
                type="checkbox"
                name="services"
                value={service.id}
              />
              {service.name} - Rp {service.price} ({service.duration} mins)
            </div>
          ))}
        </div>

        {/* Date */}
        <div>
          <label>Date</label>
          <input type="date" name="date" required />
        </div>

        {/* Start Time */}
        <div>
          <label>Start Time</label>
          <input type="time" name="startTime" required />
        </div>

        <button type="submit">Create Booking</button>
      </form>
    </div>
  )
}

export default BookingPage