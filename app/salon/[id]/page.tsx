import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">

      {/* SALON HEADER */}

      <Card>

        <CardHeader>
          <CardTitle className="text-3xl">
            {salon.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          <p className="text-muted-foreground">
            {salon.description}
          </p>

          <p>
            📍 {salon.address}
          </p>

          <p>
            📞 {salon.phone}
          </p>

          <Badge>
            {salon.openTime} - {salon.closeTime}
          </Badge>

          <div className="pt-4">

            <Link href={`/salon/${salon.id}/book`}>
              <Button>
                Book Now
              </Button>
            </Link>

          </div>

        </CardContent>

      </Card>

      <Separator />

      {/* STYLISTS */}

      <div>

        <h2 className="text-2xl font-semibold mb-6">
          Our Stylists
        </h2>

        {salon.stylists.length === 0 && (
          <p>No stylists available.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {salon.stylists.map((stylist) => (

            <Card key={stylist.id}>

              <CardHeader>
                <CardTitle>
                  {stylist.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">

                <p className="text-sm text-muted-foreground">
                  {stylist.specialization}
                </p>

                <Badge variant="outline">
                  {stylist.experience} years experience
                </Badge>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

      <Separator />

      {/* SERVICES */}

      <div>

        <h2 className="text-2xl font-semibold mb-6">
          Our Services
        </h2>

        {salon.services.length === 0 && (
          <p>No services available.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {salon.services.map((service) => (

            <Card key={service.id}>

              <CardHeader>
                <CardTitle>
                  {service.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">

                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>

                <p className="text-sm">
                  Duration: {service.duration} minutes
                </p>

                <Badge>
                  Rp {service.price}
                </Badge>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </div>
  )
}

export default DetailSalonPage