"use client"

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/mock-data";
import { authClient } from "@/lib/auth-client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Plus, TrendingUp, Wallet, PiggyBank, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok) {
          setData(json.data);
        } else {
          toast.error(json.message || "Failed to load dashboard data");
        }
      } catch (err) {
        toast.error("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const byCategory = Object.entries(data.categoryDistribution)
    .map(([name, value]) => ({ name, value: Math.round(value as number) }))
    .sort((a, b) => b.value - a.value);

  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  const savingsRate = data.totalIncome > 0 ? Math.round((data.savings / data.totalIncome) * 100) : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Overview</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Welcome back, {session?.user?.name || 'User'} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's a snapshot of your finances this month.</p>
        </div>
        <Link href="/add-transaction">
          <Button className="gradient-primary text-primary-foreground shadow-elegant">
            <Plus className="mr-1.5 h-4 w-4" /> Add transaction
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Income" value={fmt(data.totalIncome)} delta="+0.0%" icon={TrendingUp} tone="success" />
        <StatCard label="Total Expense" value={fmt(data.totalExpense)} delta="+0.0%" icon={ArrowDownRight} tone="destructive" />
        <StatCard label="Balance" value={fmt(data.currentBalance)} delta="+0.0%" icon={Wallet} tone="primary" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} delta="0 pts" icon={PiggyBank} tone="accent" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Cash flow</h3>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </div>
            <div className="h-72">
              {data.monthlyData.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={[...data.monthlyData].reverse()}>
                    <defs>
                      <linearGradient id="di" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="de" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="income" stroke="var(--color-primary)" fill="url(#di)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expense" stroke="var(--color-chart-3)" fill="url(#de)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Expense by category</h3>
            </div>
            <div className="h-64">
              {byCategory.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={byCategory.slice(0, 5)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                      {byCategory.slice(0, 5).map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No expenses recorded</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Monthly income vs expense</h3>
            </div>
            <div className="h-64">
              {data.monthlyData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={data.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                    <Bar dataKey="income" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Upcoming Goals</h3>
            <ul className="mt-4 space-y-3">
              {data.upcomingGoals.map((g: any) => (
                <li key={g._id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">{g.title}</p>
                    <p className="text-xs text-muted-foreground">Due by {new Date(g.deadline).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold">{fmt(g.targetAmount)}</span>
                </li>
              ))}
              {data.upcomingGoals.length === 0 && (
                <p className="text-sm text-muted-foreground">No goals set yet.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent transactions</h3>
            <Link href="/transactions" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border">
            {data.recentTransactions.map((t: any) => {
              const cat = CATEGORIES.find((c) => c.name === t.category);
              return (
                <li key={t._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg">
                      {cat?.icon ?? "💳"}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t.title || t.category}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.transactionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{t.method || "Cash"}</Badge>
                  </div>
                </li>
              );
            })}
            {data.recentTransactions.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No transactions found.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold">Budget health</h3>
          <p className="mt-1 text-sm text-muted-foreground">Percent of budget used per category.</p>
          <div className="mt-5 space-y-4">
            {data.budgets.map((b: any) => {
              const used = data.categoryDistribution[b.category] || 0;
              const pct = Math.min(100, Math.round((used / b.limit) * 100));
              return (
                <div key={b._id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{b.category}</span>
                    <span className="text-muted-foreground">{fmt(used)} / {fmt(b.limit)}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
            {data.budgets.length === 0 && (
              <p className="text-sm text-muted-foreground">No budgets configured.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({ label, value, delta, icon: Icon, tone }: { label: string; value: string; delta: string; icon: any; tone: "primary" | "success" | "destructive" | "accent" }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/10 text-destructive",
    accent: "bg-accent/20 text-accent-foreground",
  };
  const positive = !delta.startsWith("-");
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <span className={`grid h-9 w-9 place-items-center rounded-lg ${map[tone]}`}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 font-display text-2xl font-bold">{value}</p>
        <p className={`mt-1 flex items-center gap-1 text-xs ${positive ? "text-success" : "text-muted-foreground"}`}>
          -- vs last month
        </p>
      </CardContent>
    </Card>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
