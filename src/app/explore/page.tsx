"use client"

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { GUIDES } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom skeleton instead of relying on ui component to prevent import errors if it doesn't exist
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

const PER_PAGE = 8;

export default function ExplorePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [diff, setDiff] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(GUIDES.map((g) => g.category)))], []);

  const filtered = useMemo(() => {
    let list = GUIDES.filter((g) =>
      (q ? (g.title + g.description).toLowerCase().includes(q.toLowerCase()) : true) &&
      (cat === "all" ? true : g.category === cat) &&
      (diff === "all" ? true : g.difficulty === diff),
    );
    list = list.sort((a, b) => {
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [q, cat, diff, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Explore</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Finance guides & templates</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hand-picked, practical, and short enough to actually finish. Filter by topic or difficulty.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              className="pl-9"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v || "all"); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={diff} onValueChange={(v) => { setDiff(v || "all"); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v || "newest")}>
            <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-lg font-semibold">No guides match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or category.</p>
            <Button className="mt-4" onClick={() => { setQ(""); setCat("all"); setDiff("all"); }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((g) => (
              <Card key={g.id} className="group overflow-hidden pt-0 transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="aspect-video overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{g.category}</Badge>
                    <span>·</span>
                    <span>{g.difficulty}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-semibold">{g.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{g.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/explore/${g.id}`}>
                      <Button size="sm" variant="ghost">View details →</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button key={i} size="sm" variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </section>
    </>
  );
}
