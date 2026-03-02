import { prisma } from "@/lib/prisma";
import Link from "next/link";

const SalonPage = async () => {

    const salons = await prisma.salon.findMany({
        orderBy: {
        name: "asc",
        },
    });
  return (
    <div>
      <h1>Our Salons</h1>

      {salons.length === 0 && <p>No salons available.</p>}

      <ul>
        {salons.map((salon) => (
          <li key={salon.id}>
            <h2>{salon.name}</h2>
            <p>{salon.address}</p>
            <p>Phone: {salon.phone}</p>

            <Link href={`/salon/${salon.id}`}>
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SalonPage