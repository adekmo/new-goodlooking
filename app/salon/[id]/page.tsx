import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const DetailSalonPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const salon = await prisma.salon.findUnique({
    where: { id },
    include: {
      stylists: {
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      },
      services: {
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!salon) {
    redirect("/salon");
  }

  return (
    <div>
      <h1>{salon.name}</h1>
      <p>{salon.description}</p>
      <p>{salon.address}</p>
      <p>Phone: {salon.phone}</p>
      <p>
        Open: {salon.openTime} - {salon.closeTime}
      </p>

      <Link href={`/salon/${salon.id}/book`}>
        <button>Book Now</button>
      </Link>

      <hr />

      <h2>Our Stylists</h2>
      {salon.stylists.length === 0 && <p>No stylists available.</p>}

      <ul>
        {salon.stylists.map((stylist) => (
          <li key={stylist.id}>
            <h3>{stylist.name}</h3>
            <p>Specialization: {stylist.specialization}</p>
            <p>Experience: {stylist.experience} years</p>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Our Services</h2>
      {salon.services.length === 0 && <p>No services available.</p>}

      <ul>
        {salon.services.map((service) => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>Category: {service.category}</p>
            <p>Duration: {service.duration} minutes</p>
            <p>Price: Rp {service.price}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DetailSalonPage