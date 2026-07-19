"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, Wallet, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/add-transaction", label: "Add" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname() || "";
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };
  
  const inApp =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/ai-insights") ||
    pathname.startsWith("/add-transaction") ||
    pathname.startsWith("/profile");

  const links = inApp ? appLinks : publicLinks;
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Finwise<span className="text-primary">.</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {session ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium mr-2">{session.user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>Log out</Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                  Get started
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-2">
            {links.map((l) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            {!session ? (
              <div className="mt-2 flex gap-2 border-t border-border/60 p-2 pt-3">
                <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full gradient-primary text-primary-foreground">Get started</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-border/60 p-2 pt-3">
                <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setOpen(false); }}>Log out</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
