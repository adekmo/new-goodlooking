import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const salons = await prisma.salon.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          GoodLooking
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-10 py-24 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Booking Salon Jadi <span className="text-gray-500">Lebih Mudah</span>
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan salon terbaik, pilih stylist favoritmu, dan booking dalam
          hitungan detik.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Mulai Booking
          </Link>
          <Link
            href="#salons"
            className="px-6 py-3 border rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Lihat Salon
          </Link>
        </div>
      </section>

      {/* SALON LIST */}
      <section id="salons" className="px-10 pb-24">
        <h3 className="text-3xl font-bold mb-10 text-center">
          Salon Terbaru
        </h3>

        {salons.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada salon tersedia.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {salons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-xl font-semibold">
                  {salon.name}
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  {salon.address}
                </p>

                <Link
                  href={`/salon/${salon.id}`}
                  className="inline-block mt-4 text-sm font-medium text-black hover:underline"
                >
                  Lihat Detail →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GoodLooking. All rights reserved.
      </footer>
    </main>
  );
}