import { prisma } from "@/lib/prisma";

export default async function Home() {
  const usersCount = await prisma.user.count();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        GoodLooking Database Connected 🚀
      </h1>
      <p>Total Users in DB: {usersCount}</p>
    </main>
  );
}