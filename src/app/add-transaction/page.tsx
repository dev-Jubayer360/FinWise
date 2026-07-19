"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORIES } from "@/lib/mock-data";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2, "Title too short").max(80),
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Pick a category"),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1),
  method: z.enum(["card", "cash", "bank", "wallet"]),
  notes: z.string().max(500).optional(),
  receiptUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

// Mock AI category prediction. In production this would call Gemini via server fn.
function predictCategory(text: string): { category: string; tags: string[]; priority: "low" | "medium" | "high"; confidence: number } {
  const t = text.toLowerCase();
  const rules: [RegExp, string][] = [
    [/uber|lyft|taxi|gas|fuel|metro|bus|train/, "Transport"],
    [/whole foods|grocery|restaurant|coffee|starbucks|dinner|lunch|food/, "Food & Dining"],
    [/rent|mortgage|lease/, "Housing"],
    [/electric|water|gas bill|internet|utility|utilities/, "Utilities"],
    [/amazon|shop|store|apparel/, "Shopping"],
    [/netflix|spotify|movie|concert|game/, "Entertainment"],
    [/doctor|pharmacy|gym|health/, "Health"],
    [/course|udemy|coursera|book|school|education/, "Education"],
    [/flight|hotel|airbnb|travel|trip/, "Travel"],
    [/salary|payroll|paycheck/, "Salary"],
    [/freelance|invoice|client/, "Freelance"],
    [/dividend|interest|stock|etf|investment/, "Investments"],
  ];
  for (const [re, cat] of rules) if (re.test(t)) {
    const tags = t.split(/\s+/).filter((w) => w.length > 3).slice(0, 3);
    return { category: cat, tags, priority: /rent|mortgage|utility|salary/.test(t) ? "high" : /coffee|snack/.test(t) ? "low" : "medium", confidence: 0.86 + Math.random() * 0.1 };
  }
  return { category: "Shopping", tags: [], priority: "medium", confidence: 0.55 };
}

export default function AddTransaction() {
  const router = useRouter();
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    // @ts-expect-error Type mismatch with zod coerce and react-hook-form
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
      method: "card",
      notes: "",
      receiptUrl: "",
    },
  });

  const [prediction, setPrediction] = useState<ReturnType<typeof predictCategory> | null>(null);
  const [predicting, setPredicting] = useState(false);
  const title = watch("title");
  const notes = watch("notes");

  const runPredict = async () => {
    if (!title) return toast.info("Add a title first");
    setPredicting(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description: notes, merchant: "" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to predict");
      
      const p = data.data;
      setPrediction({
        category: p.suggestedCategory,
        tags: p.tags || [],
        priority: p.priority?.toLowerCase() || "medium",
        confidence: (p.confidenceScore || 85) / 100
      });
      setValue("category", p.suggestedCategory, { shouldValidate: true });
    } catch (err: any) {
      toast.error("Failed to predict category");
    } finally {
      setPredicting(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          paymentMethod: data.method,
          transactionDate: data.date,
          notes: data.notes,
          receiptImage: data.receiptUrl
        })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      
      toast.success("Transaction added");
      router.push("/transactions");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save transaction");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">New transaction</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Add a transaction</h1>
      <p className="mt-1 text-sm text-muted-foreground">AI will suggest a category as you type. You can always edit before saving.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Whole Foods groceries" className="mt-1.5" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" min="0" className="mt-1.5" {...register("amount")} />
                {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" className="mt-1.5" {...register("date")} />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-2 grid grid-cols-2 gap-3">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background p-3 hover:bg-muted">
                      <RadioGroupItem value="expense" id="t-expense" />
                      <div>
                        <p className="text-sm font-medium">Expense</p>
                        <p className="text-xs text-muted-foreground">Money going out</p>
                      </div>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background p-3 hover:bg-muted">
                      <RadioGroupItem value="income" id="t-income" />
                      <div>
                        <p className="text-sm font-medium">Income</p>
                        <p className="text-xs text-muted-foreground">Money coming in</p>
                      </div>
                    </label>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick or use AI" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.icon} {c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>}
              </div>
              <div>
                <Label>Payment method</Label>
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank transfer</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} className="mt-1.5" {...register("notes")} />
            </div>

            <div>
              <Label htmlFor="receipt">Receipt image URL (optional)</Label>
              <Input id="receipt" placeholder="https://..." className="mt-1.5" {...register("receiptUrl")} />
              {errors.receiptUrl && <p className="mt-1 text-xs text-destructive">{errors.receiptUrl.message}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="gradient-primary text-primary-foreground">
                {isSubmitting ? "Saving..." : "Save transaction"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setPrediction(null); }}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">AI categorization</p>
                <p className="text-xs text-muted-foreground">Predict category from title & notes</p>
              </div>
            </div>
            <Button type="button" onClick={runPredict} className="mt-4 w-full" variant="outline">
              {predicting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Suggest category</>}
            </Button>

            {prediction && (
              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold">{prediction.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${Math.round(prediction.confidence * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{Math.round(prediction.confidence * 100)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant={prediction.priority === "high" ? "destructive" : prediction.priority === "low" ? "outline" : "secondary"} className="mt-1 capitalize">
                    {prediction.priority}
                  </Badge>
                </div>
                {prediction.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Tags</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prediction.tags.map((t) => <Badge key={t} variant="outline">#{t}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </section>
  );
}
