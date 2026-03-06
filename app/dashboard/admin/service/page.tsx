export const dynamic = "force-dynamic";

import DeleteServiceButton from "@/components/DeleteServiceButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ServiceToast from "@/components/ServiceToast";

const ServicePage = async ({searchParams,}: {searchParams?: { q?: string };}) => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const keyword = searchParams?.q ?? "";

    const services = await prisma.service.findMany({
      where: {
        salonId: session.user.salonId!,
        name: {
          contains: keyword,
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <ServiceToast />
        <h1 className="text-2xl font-bold">Service Management</h1>

        <Link href="/dashboard/admin/service/create">
          <Button>+ Add Service</Button>
        </Link>
      </div>

      {/* SEARCH */}
      <form className="flex gap-2">
        <Input
          name="q"
          placeholder="Search service..."
          defaultValue={keyword}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* EMPTY STATE */}
      {services.length === 0 && (
        <div className="text-center border rounded-xl py-10 text-gray-500">
          No services found
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg">{service.name}</CardTitle>

              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Price:</span> Rp{" "}
                {service.price.toLocaleString()}
              </p>

              <p>
                <span className="font-medium">Duration:</span>{" "}
                {service.duration} minutes
              </p>

              <p>
                <span className="font-medium">Category:</span>{" "}
                {service.category}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">
                <Link
                  href={`/dashboard/admin/service/${service.id}/edit`}
                >
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>

                <DeleteServiceButton id={service.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ServicePage