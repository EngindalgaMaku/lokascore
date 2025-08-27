"use client";

import { MapPin, BarChart3, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Harita", Icon: MapPin },
  { href: "/report", label: "Analiz", Icon: BarChart3 },
  { href: "/favorites", label: "Favoriler", Icon: Star },
  { href: "/account", label: "Hesap", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-4 py-2">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  active ? "text-primary" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
