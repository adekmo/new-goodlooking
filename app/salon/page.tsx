import { prisma } from "@/lib/prisma"
import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SalonPage = async () => {

    const salons = await prisma.salon.findMany({
        orderBy: {
        name: "asc",
        },
    });
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold mb-8">
        Our Salons
      </h1>

      {salons.length === 0 && (
        <p>No salons available.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {salons.map((salon) => (

          <Card key={salon.id}>

            <CardHeader>
              <CardTitle>
                {salon.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              <p className="text-sm text-muted-foreground">
                {salon.address}
              </p>

              <Badge variant="outline">
                {salon.phone}
              </Badge>

            </CardContent>

            <CardFooter>

              <Link
                href={`/salon/${salon.id}`}
                className="w-full"
              >
                <Button className="w-full">
                  View Details
                </Button>
              </Link>

            </CardFooter>

          </Card>

        ))}

      </div>
    </div>
  )
}

export default SalonPage