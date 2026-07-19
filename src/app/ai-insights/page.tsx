"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Loader2, RefreshCw, Send, Sparkles, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "How can I save an extra $500 this month?",
  "Review my top spending categories.",
  "Am I on track for my emergency fund?",
  "Suggest a budget for next month.",
];

export default function AIInsights() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI Insights</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Your personal AI advisor</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ask anything about your money. Powered by Gemini.</p>

      <Tabs defaultValue="chat" className="mt-6">
        <TabsList>
          <TabsTrigger value="chat">Financial Advisor</TabsTrigger>
          <TabsTrigger value="report">Monthly Report</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-4">
          <ChatPanel />
        </TabsContent>
        <TabsContent value="report" className="mt-4">
          <ReportPanel />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "assistant", content: "Hi! I'm your Finwise AI advisor. Ask me anything about your spending, saving, or planning. Try one of the suggestions below to get started." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const assistant: Msg = { id: crypto.randomUUID(), role: "assistant", content: "" };
    setMessages((m) => [...m, user, assistant]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch response");
      
      const full = data.data.reply;
      let i = 0;
      const tick = () => {
        i += Math.max(1, Math.floor(full.length / 50));
        setMessages((m) => m.map((mm) => mm.id === assistant.id ? { ...mm, content: full.slice(0, i) } : mm));
        if (i < full.length) setTimeout(tick, 20);
        else setStreaming(false);
      };
      tick();
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch response");
      setMessages((m) => m.map((mm) => mm.id === assistant.id ? { ...mm, content: "Sorry, I ran into an error connecting to Gemini." } : mm));
      setStreaming(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex h-[70vh] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground">
                  <Brain className="h-4 w-4" />
                </span>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted"}`}>
                {m.content.split("\n").map((line, i) => <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>)}
                {streaming && m.role === "assistant" && !m.content && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {m.role === "user" && (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted">
                  <User className="h-4 w-4" />
                </span>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border/60 p-4">
          {messages.length <= 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs hover:bg-muted">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your money..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" disabled={streaming || !input.trim()} className="gradient-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportPanel() {
  const [length, setLength] = useState([50]);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<null | { summary: string; insights: string[]; opportunities: string[]; score: number }>(null);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/ai/analyze`, {
        method: "POST",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate report");
      
      const aiData = data.data;
      setReport({
        summary: aiData.summary || "No summary provided.",
        insights: [
          ...(aiData.monthlyAdvice ? [aiData.monthlyAdvice] : []),
          ...(aiData.riskAnalysis ? [aiData.riskAnalysis] : []),
          ...(aiData.budgetOptimization ? [aiData.budgetOptimization] : [])
        ],
        opportunities: aiData.savingsTips || [],
        score: aiData.financialHealthScore || 0,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="font-semibold">Monthly report</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Generate an AI summary of your finances for this month.</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Detail level: {length[0] < 33 ? "Brief" : length[0] < 66 ? "Standard" : "Deep"}</p>
            <Slider value={length} onValueChange={(val) => setLength(val as number[])} max={100} step={1} />
          </div>

          <Button onClick={generate} disabled={generating} className="mt-6 w-full gradient-primary text-primary-foreground">
            {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : report ? <><RefreshCw className="mr-2 h-4 w-4" /> Regenerate</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate report</>}
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          {!report ? (
            <div className="grid h-full min-h-[300px] place-items-center text-center">
              <div>
                <Brain className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-semibold">No report yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Click Generate to let Gemini analyze your real data.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Financial summary</h3>
                  <Badge className={report.score >= 70 ? "bg-success/15 text-success" : report.score >= 40 ? "bg-amber-500/15 text-amber-600" : "bg-destructive/15 text-destructive"}>
                    Health Score: {report.score}/100
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{report.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold">Key insights & Risk</h4>
                <ul className="mt-2 space-y-1.5">
                  {report.insights.map((i, idx) => <li key={idx} className="text-sm text-muted-foreground">• {i}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Saving opportunities</h4>
                <ul className="mt-2 space-y-1.5">
                  {report.opportunities.map((i, idx) => <li key={idx} className="text-sm text-muted-foreground">→ {i}</li>)}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
