import DeleteServiceButton from '@/components/DeleteServiceButton';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const ServicePage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const services = await prisma.service.findMany({
        where: {
        salonId: session.user.salonId!,
        },
        orderBy: {
        name: "desc",
        },
    });
  return (
    <div>
      <h1>Service Management</h1>

      <Link href="/dashboard/admin/service/create">
        ➕ Add Service
      </Link>

      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>Price: Rp {service.price}</p>
            <p>Duration: {service.duration} minutes</p>
            <p>Category: {service.category}</p>
            <p>Status: {service.isActive ? "Active" : "Inactive"}</p>

            <Link href={`/dashboard/admin/service/${service.id}/edit`}>
              Edit
            </Link>
            <DeleteServiceButton id={service.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicePage