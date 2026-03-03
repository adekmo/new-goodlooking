"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Scissors,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { Session } from "next-auth";

const DashboardShell = ({children,session,}: {children: React.ReactNode; session: Session;}) => {

  const pathname = usePathname();
  const role = session.user.role;

  const menuItems = {
        SUPERADMIN: [
        {
            label: "Manage Salons",
            href: "/dashboard/superadmin/salons",
            icon: Store,
        },
        {
            label: "Manage Users",
            href: "/dashboard/superadmin/users",
            icon: Users,
        },
        ],
        ADMIN: [
        {
            label: "Dashboard",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            label: "Services",
            href: "/dashboard/admin/service",
            icon: Scissors,
        },
        {
            label: "Stylists",
            href: "/dashboard/admin/stylist",
            icon: User,
        },
        {
            label: "Bookings",
            href: "/dashboard/admin/booking",
            icon: Calendar,
        },
        ],
        CUSTOMER: [
        {
            label: "My Bookings",
            href: "/dashboard/customer/booking",
            icon: Calendar,
        },
        ],
    };

    const currentMenu =
        menuItems[role as keyof typeof menuItems] || [];
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-800">
          GoodLooking
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition",
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-6 py-4 text-sm border-t border-gray-800 hover:bg-gray-800 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">
            Role: <span className="font-semibold">{role}</span>
          </div>

          <div className="text-sm font-medium">
            {session.user.name}
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardShell