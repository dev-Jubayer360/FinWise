"use client"

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { GUIDES } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function GuideDetail() {
  const params = useParams();
  const id = params?.id as string;
  const guide = GUIDES.find((g) => g.id === id);

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([
    { id: "c1", name: "Sam L.", body: "Best explanation of this I've read. Doing it this weekend.", when: "2 days ago" },
    { id: "c2", name: "Nina K.", body: "Loved the concrete example — very practical.", when: "1 week ago" },
  ]);
  const [text, setText] = useState("");

  if (!guide) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Guide not found</h1>
        <p className="mt-2 text-muted-foreground">This guide may have been moved.</p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const related = GUIDES.filter((g) => g.category === guide.category && g.id !== guide.id).slice(0, 3);

  return (
    <article>
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All guides
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">{guide.category}</Badge>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{guide.difficulty}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{new Date(guide.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{guide.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{guide.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="aspect-[16/8] overflow-hidden rounded-2xl border border-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={guide.image} alt={guide.title} className="h-full w-full object-cover" />
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Overview</h2>
          <p className="mt-3 text-muted-foreground">{guide.body}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Key benefits</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {guide.benefits.map((b: string) => (
              <li key={b} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-secondary" /> {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Rate this guide</h2>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => { setRating(n); toast.success("Thanks for rating!"); }} aria-label={`${n} stars`}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{rating ? `${rating} / 5` : "No rating yet"}</span>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Comments</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              setComments([{ id: crypto.randomUUID(), name: "You", body: text, when: "just now" }, ...comments]);
              setText("");
              toast.success("Comment posted");
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit">Post</Button>
          </form>
          <ul className="mt-6 space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="rounded-xl border border-border/60 bg-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.when}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">Related guides</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Card key={r.id} className="overflow-hidden pt-0 transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt={r.title} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <p className="line-clamp-2 text-sm font-medium">{r.title}</p>
                    <Link href={`/explore/${r.id}`} className="mt-2 inline-block text-xs text-primary hover:underline">
                      Read guide →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
