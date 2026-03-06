import DeleteStylistButton from "@/components/DeleteStylistButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import StylistToolbar from "@/components/StylistToolbar";


const StylistPage = async ({searchParams,}: {searchParams: {search?: string;specialization?: string;};}) => {

    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== Role.ADMIN) {
        redirect("/");
    }

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!admin?.salonId) {
        return <div>Kamu belum memiliki salon.</div>;
    }

    const stylists = await prisma.stylist.findMany({
      where: {
        salonId: admin.salonId,

        name: searchParams.search
          ? {
              contains: searchParams.search,
              mode: "insensitive",
            }
          : undefined,

        specialization: searchParams.specialization
          ? searchParams.specialization
          : undefined,
      },
      orderBy: { name: "asc" },
    });
  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stylists</h1>

        <Link href="/dashboard/admin/stylist/create">
          <Button className="rounded-xl">+ Add Stylist</Button>
        </Link>
      </div>

      <StylistToolbar />

      {stylists.length === 0 && (
        <div className="text-center py-10 text-gray-500 border rounded-xl">
          Belum ada stylist. Tambahkan stylist pertama.
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stylists.map((stylist) => (
          <Card key={stylist.id} className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {stylist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-semibold">
                  {stylist.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {stylist.specialization}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {stylist.experience} years experience
                </Badge>

                <Badge className="bg-green-100 text-green-700">
                  Active
                </Badge>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="millie">
                  {stylist.specialization}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2">

                {/* CALENDAR */}

                <Link
                  href={`/dashboard/admin/stylist/${stylist.id}/calendar`}
                >
                  <Button size="sm" variant="secondary">
                    Calendar
                  </Button>
                </Link>
                <Link href={`/dashboard/admin/stylist/${stylist.id}/availability`}>
                  <Button size="sm" variant="secondary">
                    Availability
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/admin/stylist/${stylist.id}/edit`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                </Link>
                <DeleteStylistButton id={stylist.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StylistPage