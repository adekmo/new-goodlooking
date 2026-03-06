import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import StylistCalendar from "@/components/StylistCalendar";
import { CalendarEvent } from "@/types/calendar";

const StylistCalendarPage = async ({ params,}: { params: Promise<{ id: string }>; }) => {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const stylist = await prisma.stylist.findUnique({
        where: { id },
        include: {
        bookings: {
            where: {
            status: {
                not: "CANCELLED",
            },
            },
            include: {
            services: {
                include: {
                service: true,
                },
            },
            customer: true,
            },
        },
        availability: true,
        },
    });

    if (!stylist) redirect("/dashboard/admin/stylist");

    const events: CalendarEvent[] = stylist.bookings.map((booking) => {
        const date = new Date(booking.date);

        const [sh, sm] = booking.startTime.split(":").map(Number);
        const [eh, em] = booking.endTime.split(":").map(Number);

        const start = new Date(date);
        start.setHours(sh, sm);

        const end = new Date(date);
        end.setHours(eh, em);

        const services = booking.services
        .map((s) => s.service.name)
        .join(", ");

        return {
        title: `${services} - ${booking.customer.name}`,
        start,
        end,
        resource: {
            bookingId: booking.id,
            status: booking.status,
        },
        };
    });

    const backgroundEvents: CalendarEvent[] = [];

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    for (
        let day = new Date(today);
        day <= endDate;
        day.setDate(day.getDate() + 1)
    ) {
        const weekday = day.getDay();

        const avail = stylist.availability.find(
        (a) => a.dayOfWeek === weekday
        );

        if (!avail) continue;

        const [sh, sm] = avail.startTime.split(":").map(Number);
        const [eh, em] = avail.endTime.split(":").map(Number);

        const start = new Date(day);
        start.setHours(sh, sm);

        const end = new Date(day);
        end.setHours(eh, em);

        backgroundEvents.push({
        start,
        end,
        });
    }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {stylist.name} Calendar
      </h1>

      <StylistCalendar
        events={events}
        backgroundEvents={backgroundEvents}
      />
    </div>
  )
}

export default StylistCalendarPage