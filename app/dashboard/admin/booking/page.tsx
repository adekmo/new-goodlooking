export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role, BookingStatus } from "@prisma/client";
import Link from "next/link";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const AdminBookingPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const validStatuses: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ];

  const statusParam =
    typeof searchParams?.status === "string"
      ? searchParams.status
      : undefined;

  const statusFilter = validStatuses.includes(
    statusParam as BookingStatus
  )
    ? (statusParam as BookingStatus)
    : undefined;

  const bookings = await prisma.booking.findMany({
    where: {
      salonId: session.user.salonId!,
      ...(statusFilter && { status: statusFilter }),
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

  const statusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking Management</h1>

        <div className="flex gap-2 text-sm">
          <Link href="/dashboard/admin/booking" className="px-3 py-1 border rounded-lg">
            All
          </Link>
          <Link href="?status=PENDING" className="px-3 py-1 border rounded-lg">
            Pending
          </Link>
          <Link href="?status=CONFIRMED" className="px-3 py-1 border rounded-lg">
            Confirmed
          </Link>
          <Link href="?status=COMPLETED" className="px-3 py-1 border rounded-lg">
            Completed
          </Link>
          <Link href="?status=CANCELLED" className="px-3 py-1 border rounded-lg">
            Cancelled
          </Link>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center text-gray-500 py-10 border rounded-xl">
          No bookings found.
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">
                  {booking.customer.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Stylist: {booking.stylist.name}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.date.toDateString()} • {booking.startTime} -{" "}
                  {booking.endTime}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">Services:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {booking.services.map((bs) => (
                  <li key={bs.id}>{bs.service.name}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="font-semibold">
                Total: Rp {booking.totalPrice.toLocaleString()}
              </p>

              <div className="flex gap-2">
                {booking.status === "PENDING" && (
                  <>
                    <form
                      action={`/api/booking/${booking.id}/confirm`}
                      method="POST"
                    >
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
                        Confirm
                      </button>
                    </form>

                    <form
                      action={`/api/booking/${booking.id}/cancel`}
                      method="POST"
                    >
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                        Cancel
                      </button>
                    </form>
                  </>
                )}

                {booking.status === "CONFIRMED" && (
                  <form
                    action={`/api/booking/${booking.id}/complete`}
                    method="POST"
                  >
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">
                      Mark Complete
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminBookingPage