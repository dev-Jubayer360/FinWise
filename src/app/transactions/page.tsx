"use client"

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CATEGORIES } from "@/lib/mock-data";
import { Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2, Upload, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

const PER_PAGE = 8;

export default function Transactions() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [type, setType] = useState("all");
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [viewingTx, setViewingTx] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/transactions`, {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) {
        setRows(json.data);
      } else {
        toast.error(json.message || "Failed to fetch transactions");
      }
    } catch (err) {
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const now = Date.now();
    const days: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
    let list = rows.filter((t) => {
      const ql = q.toLowerCase();
      const matchQ = !q || t.title.toLowerCase().includes(ql) || t.category.toLowerCase().includes(ql) || String(t.amount).includes(q);
      const matchCat = cat === "all" || t.category === cat;
      const matchType = type === "all" || t.type === type;
      const matchRange = range === "all" || (now - new Date(t.transactionDate).getTime()) / 86400000 <= days[range];
      return matchQ && matchCat && matchType && matchRange;
    });
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      if (sort === "oldest") return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      if (sort === "amount") return b.amount - a.amount;
      if (sort === "high-expense") return (b.type === "expense" ? b.amount : 0) - (a.type === "expense" ? a.amount : 0);
      if (sort === "high-income") return (b.type === "income" ? b.amount : 0) - (a.type === "income" ? a.amount : 0);
      return 0;
    });
    return list;
  }, [rows, q, cat, type, range, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCsv = () => {
    const header = ["id", "title", "amount", "type", "category", "date", "paymentMethod", "notes"].join(",");
    const body = filtered.map((r) => [r._id, `"${r.title}"`, r.amount, r.type, r.category, r.transactionDate, r.paymentMethod, `"${r.notes ?? ""}"`].join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const importCsv = () => toast.info("CSV import UI ready — wire to backend when available");

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/transactions/${toDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setRows((r) => r.filter((x) => x._id !== toDelete));
        toast.success("Transaction deleted");
      } else {
        const json = await res.json();
        toast.error(json.message || "Failed to delete transaction");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Transactions</p>
            <h1 className="mt-1 font-display text-3xl font-bold">Manage transactions</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={importCsv}><Upload className="mr-1.5 h-4 w-4" /> Import CSV</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
            <Link href="/add-transaction">
              <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="mr-1.5 h-4 w-4" /> New</Button>
            </Link>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search title, category, amount..." className="pl-9" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
              </div>
              <Select value={cat} onValueChange={(v) => { setCat(v || "all"); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={(v) => { setType(v || "all"); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Both</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={range} onValueChange={(v) => { setRange(v || "all"); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Date range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>{filtered.length} results</span>
              <Select value={sort} onValueChange={(v) => setSort(v || "newest")}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="amount">Highest amount</SelectItem>
                  <SelectItem value="high-expense">Highest expense</SelectItem>
                  <SelectItem value="high-income">Highest income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="p-0">
            {pageItems.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-lg font-semibold">No transactions found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try clearing filters or add a new transaction.</p>
                <Link href="/add-transaction" className="mt-4 inline-block">
                  <Button><Plus className="mr-1.5 h-4 w-4" /> Add transaction</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((t) => {
                      const cat = CATEGORIES.find((c) => c.name === t.category);
                      return (
                        <TableRow key={t._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">{cat?.icon ?? "💳"}</span>
                              <div>
                                <p className="text-sm font-medium">{t.title}</p>
                                {t.notes && <p className="text-xs text-muted-foreground">{t.notes}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="secondary">{t.category}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground capitalize">{t.paymentMethod || 'Cash'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(t.transactionDate).toLocaleDateString()}</TableCell>
                          <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setViewingTx(t)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingTx(t)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setToDelete(t._id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button key={i} size="sm" variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </section>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Dialog */}
      <Dialog open={!!viewingTx} onOpenChange={(o) => !o && setViewingTx(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {viewingTx && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Title</span>
                <span className="col-span-3">{viewingTx.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Amount</span>
                <span className={`col-span-3 font-semibold ${viewingTx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                  {viewingTx.type === 'income' ? '+' : '-'}${viewingTx.amount.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Date</span>
                <span className="col-span-3">{new Date(viewingTx.transactionDate).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Category</span>
                <span className="col-span-3"><Badge variant="secondary">{viewingTx.category}</Badge></span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right text-sm">Method</span>
                <span className="col-span-3 capitalize">{viewingTx.paymentMethod || 'Cash'}</span>
              </div>
              {viewingTx.notes && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-semibold text-right text-sm">Notes</span>
                  <span className="col-span-3 text-sm text-muted-foreground">{viewingTx.notes}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewingTx(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingTx && (
        <EditTransactionDialog
          tx={editingTx}
          onClose={() => setEditingTx(null)}
          onSave={(updated) => {
            setRows((prev) => prev.map((t) => t._id === updated._id ? { ...t, ...updated } : t));
            setEditingTx(null);
          }}
        />
      )}
    </>
  );
}

function EditTransactionDialog({ tx, onClose, onSave }: { tx: any, onClose: () => void, onSave: (updated: any) => void }) {
  const [data, setData] = useState({ ...tx });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/transactions/${tx._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          paymentMethod: data.paymentMethod,
          transactionDate: data.transactionDate,
          notes: data.notes,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Transaction updated successfully");
        onSave(data);
      } else {
        const json = await res.json();
        toast.error(json.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating transaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount</Label>
              <Input type="number" step="0.01" min="0" value={data.amount} onChange={e => setData({...data, amount: Number(e.target.value)})} required className="mt-1" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={new Date(data.transactionDate).toISOString().slice(0, 10)} onChange={e => setData({...data, transactionDate: e.target.value})} required className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={data.type} onValueChange={v => setData({...data, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={data.category} onValueChange={v => setData({...data, category: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Payment Method</Label>
            <Select value={data.paymentMethod || "card"} onValueChange={v => setData({...data, paymentMethod: v})}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank transfer</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Input value={data.notes || ""} onChange={e => setData({...data, notes: e.target.value})} className="mt-1" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
