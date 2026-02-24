import { Role } from "@prisma/client";
// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      salonId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    salonId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    salonId: string | null;
  }
}