import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const BookingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

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
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Book at {salon.name}
      </h1>

      <BookingForm salon={salon} />
    </div>
  )
}

export default BookingPage