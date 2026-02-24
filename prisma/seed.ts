import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // SUPERADMIN
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@goodlooking.com",
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  // Create 2 Salons
  for (let i = 1; i <= 2; i++) {
    const salon = await prisma.salon.create({
      data: {
        name: `Luxury Salon ${i}`,
        address: `Jl. Premium No.${i}`,
        phone: "081234567890",
        description: "Premium hair & beauty experience.",
        openTime: "09:00",
        closeTime: "21:00",
      },
    });

    // Admin for each salon
    await prisma.user.create({
      data: {
        name: `Salon Admin ${i}`,
        email: `admin${i}@goodlooking.com`,
        password: hashedPassword,
        role: Role.ADMIN,
        salonId: salon.id,
      },
    });

    // Stylists
    for (let s = 1; s <= 3; s++) {
      await prisma.stylist.create({
        data: {
          name: `Stylist ${s} - Salon ${i}`,
          specialization: "Hair Styling",
          experience: 5 + s,
          salonId: salon.id,
        },
      });
    }

    // Services
    const services = [
      { name: "Hair Cut", price: 100000, duration: 45 },
      { name: "Hair Coloring", price: 300000, duration: 120 },
      { name: "Hair Spa", price: 150000, duration: 60 },
      { name: "Keratin Treatment", price: 400000, duration: 150 },
      { name: "Scalp Treatment", price: 200000, duration: 75 },
    ];

    for (const service of services) {
      await prisma.service.create({
        data: {
          name: service.name,
          description: "Professional service",
          price: service.price,
          duration: service.duration,
          category: "Hair",
          salonId: salon.id,
        },
      });
    }
  }

  // Demo Customer
  await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@goodlooking.com",
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });