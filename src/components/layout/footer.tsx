import Link from "next/link";
import { Wallet } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">Finwise<span className="text-primary">.</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Track smarter. Save better. Personal finance intelligence powered by AI.
          </p>
          <div className="mt-5 flex gap-3 text-sm font-medium text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground">Twitter</a>
            <a href="#" aria-label="GitHub" className="hover:text-foreground">GitHub</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
        <FooterCol title="Product" links={[
          { href: "/explore", label: "Explore" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/analytics", label: "Analytics" },
          { href: "/ai-insights", label: "AI Insights" },
        ]} />
        <FooterCol title="Company" links={[
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
          { href: "/explore", label: "Guides" },
        ]} />
        <FooterCol title="Legal" links={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Finwise. All rights reserved.</p>
          <p>Made with care for your money.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
