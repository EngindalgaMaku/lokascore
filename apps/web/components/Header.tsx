"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Analizler", href: "/report" },
    { name: "Favoriler", href: "/favorites" },
    { name: "Hesabım", href: "/account" },
    { name: "Admin Panel", href: "/admin", isAdmin: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-responsive flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <img
                src="/icon-192.png"
                alt="LOKASCORE Logo"
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight">
                LOKASCORE
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Veri ve YZ destekli lokasyon analizi
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                item.isAdmin ? "text-orange-600 hover:text-orange-700" : ""
              }`}
              title={item.isAdmin ? "Admin Paneline Git" : ""}
            >
              {item.isAdmin && <span className="mr-1">⚙️</span>}
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/contact" className="btn btn-primary">
            İletişime Geç
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü Aç"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 w-full max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src="/icon-192.png"
                    alt="LOKASCORE Logo"
                    className="h-8 w-8 object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-lg font-bold">LOKASCORE</span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 hover:bg-secondary ${
                        item.isAdmin ? "text-orange-600" : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.isAdmin && <span className="mr-2">⚙️</span>}
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/contact"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    İletişime Geç
                  </Link>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Gizlilik
                    </Link>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Koşullar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
