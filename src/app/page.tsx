"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Globe,
  LineChart,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/mock-data";

const chartData = [
  { m: "Jan", income: 5200, expense: 3400 },
  { m: "Feb", income: 5400, expense: 3600 },
  { m: "Mar", income: 5800, expense: 3200 },
  { m: "Apr", income: 6100, expense: 3900 },
  { m: "May", income: 6300, expense: 3700 },
  { m: "Jun", income: 6500, expense: 3500 },
  { m: "Jul", income: 6800, expense: 4100 },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New: AI Financial Advisor is here
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Track smarter.{" "}
              <span className="text-gradient">Save better.</span>
              <br />
              Powered by AI.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
            >
              Finwise turns your daily spending into clear insights, categorizes every
              transaction automatically, and gives personalized advice to hit your money
              goals faster.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                  Start free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  See live demo
                </Button>
              </Link>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> No credit card</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> Bank-level security</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-secondary" /> Free forever plan</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-border/60 bg-card p-4 shadow-elegant">
              <div className="flex items-center gap-2 pb-3">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-3 text-xs text-muted-foreground">finwise.app/dashboard</span>
              </div>
              <div className="grid gap-4 rounded-2xl bg-background p-4 sm:grid-cols-3">
                <StatMini label="Balance" value="$12,480" tone="primary" icon={Wallet} />
                <StatMini label="Income" value="$6,500" tone="success" icon={TrendingUp} />
                <StatMini label="Savings" value="46%" tone="accent" icon={PiggyBank} />
                <div className="sm:col-span-3 rounded-xl border border-border/60 bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Cash flow</p>
                    <p className="text-xs text-muted-foreground">Last 7 months</p>
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                        <Area type="monotone" dataKey="income" stroke="var(--color-primary)" fill="url(#gi)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expense" stroke="var(--color-chart-3)" fill="url(#ge)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border/60 bg-card p-3 shadow-card sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/15 text-secondary">
                  <Brain className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">AI suggestion</p>
                  <p className="text-sm font-medium">Trim dining by 12% to hit your goal</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <Section eyebrow="Features" title="Everything you need to run your money" subtitle="One workspace for tracking, analysis, and AI-driven guidance.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BarChart3, title: "Real-time dashboard", desc: "Income, spending, savings rate — always up to date." },
            { icon: Brain, title: "AI advisor", desc: "Personalized advice grounded in your actual transactions." },
            { icon: Zap, title: "Auto-categorization", desc: "Every transaction sorted, tagged, and prioritized instantly." },
            { icon: Target, title: "Goals & budgets", desc: "Set sinking funds for anything and watch progress fill up." },
            { icon: Bell, title: "Smart alerts", desc: "Bills, unusual charges, and category overspend before it hurts." },
            { icon: ShieldCheck, title: "Private by design", desc: "Encrypted at rest and in transit. Your data is yours." },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Card className="h-full transition-all hover:shadow-elegant hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section eyebrow="Coverage" title="Every category that matters" subtitle="From daily coffee to your investment dividends — everything gets a home.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="rounded-xl border border-border/60 bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-card">
              <div className="text-2xl">{c.icon}</div>
              <p className="mt-2 text-sm font-medium">{c.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI FEATURES */}
      <Section eyebrow="AI" title="Two AI features that pay for themselves" subtitle="Not a chatbot bolted on — real assistance woven into every workflow.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">AI Financial Advisor</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask anything about your money. Get advice grounded in your income, expenses, and goals.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {["Personalized monthly savings plan", "Budget optimization", "Goal-based follow-ups", "Conversation memory"].map((x) => (
                  <li key={x} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-secondary" /> {x}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Zap className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">AI Expense Categorization</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Type a title — Finwise predicts the category, tags, and priority with a confidence score.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {["Category prediction", "Auto tags", "Priority scoring", "Editable before save"].map((x) => (
                  <li key={x} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-secondary" /> {x}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { k: "$1.2B+", v: "Tracked across users" },
            { k: "94%", v: "AI categorization accuracy" },
            { k: "23%", v: "Average savings rate lift" },
            { k: "48k", v: "Active households" },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <p className="font-display text-3xl font-extrabold text-gradient sm:text-4xl">{s.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Section eyebrow="How it works" title="Set up in under three minutes" subtitle="No spreadsheets. No manual tagging. Just clarity.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: CreditCard, title: "1. Add transactions", desc: "Manual entry, CSV import, or connect an account." },
            { icon: Brain, title: "2. AI does the boring part", desc: "Categorized, tagged, and summarized automatically." },
            { icon: LineChart, title: "3. Act on insights", desc: "Follow the plan, watch savings grow." },
          ].map((s) => (
            <Card key={s.title}>
              <CardContent className="p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/15 text-secondary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="income" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section eyebrow="Loved by" title="What people say" subtitle="Real feedback from Finwise members.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Amelia R.", role: "Product designer", q: "The AI advisor caught two subscriptions I forgot about and saved me $34 a month. It paid for itself immediately.", avatar: "AR" },
            { name: "David K.", role: "Freelance dev", q: "I finally see where my money goes without opening a spreadsheet. The categorization is genuinely accurate.", avatar: "DK" },
            { name: "Priya S.", role: "Marketing lead", q: "The monthly report is the first financial thing I actually read. It feels like a coach in my pocket.", avatar: "PS" },
          ].map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.q}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Common questions" subtitle="Anything else? Reach out from the Contact page.">
        <FAQ />
      </Section>

      {/* NEWSLETTER */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Money tips, once a week</h2>
          <p className="mt-3 text-muted-foreground">Short, practical, no spam. Unsubscribe any time.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" className="gradient-primary text-primary-foreground">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 text-primary-foreground shadow-elegant sm:p-14">
          <Globe className="absolute -right-10 -top-10 h-64 w-64 opacity-10" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Ready to run your money like a pro?</h2>
            <p className="mt-3 text-primary-foreground/90">Join 48,000+ households using Finwise to spend less and save more.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-secondary-foreground">
                  Create free account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10">
                  Explore the demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatMini({ label, value, tone, icon: Icon }: { label: string; value: string; tone: "primary" | "success" | "accent"; icon: any }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    accent: "bg-accent/20 text-accent-foreground",
  };
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${map[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function Section({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Is my financial data safe?", a: "Yes. Data is encrypted at rest and in transit. We never sell or share your data with third parties." },
    { q: "Do I need to connect my bank account?", a: "No. You can add transactions manually, import from CSV, or connect an account — whatever you prefer." },
    { q: "How accurate is the AI categorization?", a: "Around 94% on typical merchants. You can always edit before saving, and the system learns from your corrections." },
    { q: "Is there a free plan?", a: "Yes — Finwise is free forever for personal use, including all AI features with generous monthly limits." },
    { q: "Can I export my data?", a: "Anytime. Export to CSV from the Transactions page in one click." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border/60 bg-card">
      {items.map((it, i) => (
        <div key={it.q}>
          <button
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium">{it.q}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-6 pb-5 text-sm text-muted-foreground">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}
