import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="max-w-5xl mx-auto py-10 space-y-6">

      <h1 className="text-3xl font-bold">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-muted-foreground">
          You haven't made any bookings yet.
        </p>
      )}

      {bookings.map((booking) => (

        <Card key={booking.id}>

          <CardHeader className="flex flex-row items-center justify-between">

            <CardTitle>
              {booking.salon.name}
            </CardTitle>

            <Badge
              variant={
                booking.status === "CONFIRMED"
                  ? "default"
                  : booking.status === "PENDING"
                  ? "secondary"
                  : booking.status === "CANCELLED"
                  ? "destructive"
                  : "outline"
              }
            >
              {booking.status}
            </Badge>

          </CardHeader>

          <CardContent className="space-y-3">

            <p>
              <strong>Stylist:</strong> {booking.stylist.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {booking.date.toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {booking.startTime} - {booking.endTime}
            </p>

            <Separator />

            <div>
              <p className="font-semibold mb-2">
                Services
              </p>

              <ul className="space-y-1 text-sm text-muted-foreground">
                {booking.services.map((s) => (
                  <li key={s.id}>
                    {s.service.name}
                  </li>
                ))}
              </ul>
            </div>

          </CardContent>

        </Card>

      ))}

    </div>
  )
}

export default CustomerBookingPage