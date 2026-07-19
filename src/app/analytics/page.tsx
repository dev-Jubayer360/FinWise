"use client"

import { Card, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dashboard`, {
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok) {
          setData(json.data);
        } else {
          toast.error(json.message || "Failed to load analytics data");
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

  const monthly = [...data.monthlyData].reverse().map((item: any) => ({
    ...item,
    savings: item.income > item.expense ? item.income - item.expense : 0
  }));

  const byCategory = Object.entries(data.categoryDistribution)
    .map(([name, value]) => ({ name, value: Math.round(value as number) }))
    .sort((a, b) => b.value - a.value);

  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Analytics</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Understand your money</h1>
      <p className="mt-1 text-sm text-muted-foreground">Visual breakdown of income, expense, categories, and savings trend.</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly income">
          {monthly.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="income" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
          )}
        </ChartCard>

        <ChartCard title="Monthly expense">
          {monthly.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="expense" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
          )}
        </ChartCard>

        <ChartCard title="Category distribution">
          {byCategory.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory.slice(0, 6)} dataKey="value" nameKey="name" outerRadius={100}>
                  {byCategory.slice(0, 6).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No expenses found</div>
          )}
        </ChartCard>

        <ChartCard title="Savings trend">
          {monthly.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Line type="monotone" dataKey="savings" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
          )}
        </ChartCard>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6">
          <h3 className="font-semibold">Cash flow overview</h3>
          <div className="mt-4 h-72">
            {monthly.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="ai" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ae" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={ttStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="var(--color-primary)" fill="url(#ai)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="var(--color-chart-3)" fill="url(#ae)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

const ttStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold">{title}</h3>
        <div className="mt-4 h-64">{children}</div>
      </CardContent>
    </Card>
  );
}
