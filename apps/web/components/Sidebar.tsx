"use client";

import Link from "next/link";
import { MapPin, BarChart3, Star, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Harita", Icon: MapPin },
  { href: "/report", label: "Analiz", Icon: BarChart3 },
  { href: "/favorites", label: "Favoriler", Icon: Star },
  { href: "/account", label: "Hesap", Icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-[100svh] w-64 shrink-0 border-r bg-background/95 p-4 backdrop-blur md:block">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold">LOKASCORE</div>
        <ThemeToggle />
      </div>
      <nav className="space-y-1">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active ? "bg-secondary text-primary" : "hover:bg-secondary/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
