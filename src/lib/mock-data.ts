// Static mock data + a tiny in-memory store used across the frontend.
// Backend integration will replace this later.

export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TxType;
  date: string; // ISO
  method: "card" | "cash" | "bank" | "wallet";
  notes?: string;
  receiptUrl?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  createdAt: string;
  image: string;
  body: string;
  benefits: string[];
}

export const CATEGORIES: { name: string; icon: string; color: string }[] = [
  { name: "Food & Dining", icon: "🍽️", color: "oklch(0.7 0.15 30)" },
  { name: "Transport", icon: "🚗", color: "oklch(0.7 0.15 220)" },
  { name: "Housing", icon: "🏠", color: "oklch(0.7 0.15 280)" },
  { name: "Utilities", icon: "💡", color: "oklch(0.75 0.15 90)" },
  { name: "Shopping", icon: "🛍️", color: "oklch(0.7 0.18 340)" },
  { name: "Entertainment", icon: "🎬", color: "oklch(0.7 0.18 300)" },
  { name: "Health", icon: "💊", color: "oklch(0.7 0.16 160)" },
  { name: "Education", icon: "📚", color: "oklch(0.7 0.15 250)" },
  { name: "Travel", icon: "✈️", color: "oklch(0.7 0.15 190)" },
  { name: "Salary", icon: "💼", color: "oklch(0.7 0.16 155)" },
  { name: "Freelance", icon: "🧑‍💻", color: "oklch(0.72 0.14 175)" },
  { name: "Investments", icon: "📈", color: "oklch(0.7 0.18 130)" },
];

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", title: "Monthly Salary", amount: 6500, category: "Salary", type: "income", date: daysAgo(2), method: "bank" },
  { id: "t2", title: "Whole Foods", amount: 128.4, category: "Food & Dining", type: "expense", date: daysAgo(3), method: "card", notes: "Weekly groceries" },
  { id: "t3", title: "Uber to airport", amount: 42.15, category: "Transport", type: "expense", date: daysAgo(4), method: "card" },
  { id: "t4", title: "Netflix", amount: 15.99, category: "Entertainment", type: "expense", date: daysAgo(5), method: "card" },
  { id: "t5", title: "Rent", amount: 1850, category: "Housing", type: "expense", date: daysAgo(7), method: "bank" },
  { id: "t6", title: "Freelance project", amount: 1200, category: "Freelance", type: "income", date: daysAgo(9), method: "bank" },
  { id: "t7", title: "Electric bill", amount: 92.7, category: "Utilities", type: "expense", date: daysAgo(10), method: "bank" },
  { id: "t8", title: "Amazon order", amount: 214.5, category: "Shopping", type: "expense", date: daysAgo(11), method: "card" },
  { id: "t9", title: "Pharmacy", amount: 38.2, category: "Health", type: "expense", date: daysAgo(13), method: "card" },
  { id: "t10", title: "Coursera subscription", amount: 49, category: "Education", type: "expense", date: daysAgo(14), method: "card" },
  { id: "t11", title: "Dividends", amount: 320, category: "Investments", type: "income", date: daysAgo(16), method: "bank" },
  { id: "t12", title: "Flight to NYC", amount: 289, category: "Travel", type: "expense", date: daysAgo(18), method: "card" },
  { id: "t13", title: "Coffee", amount: 5.4, category: "Food & Dining", type: "expense", date: daysAgo(19), method: "cash" },
  { id: "t14", title: "Gym membership", amount: 39, category: "Health", type: "expense", date: daysAgo(20), method: "card" },
  { id: "t15", title: "Concert tickets", amount: 145, category: "Entertainment", type: "expense", date: daysAgo(22), method: "card" },
  { id: "t16", title: "Gas station", amount: 58.3, category: "Transport", type: "expense", date: daysAgo(24), method: "card" },
  { id: "t17", title: "Restaurant dinner", amount: 86.75, category: "Food & Dining", type: "expense", date: daysAgo(26), method: "card" },
  { id: "t18", title: "Internet", amount: 60, category: "Utilities", type: "expense", date: daysAgo(28), method: "bank" },
];

export const UPCOMING_BILLS = [
  { id: "b1", title: "Rent", amount: 1850, dueInDays: 3, category: "Housing" },
  { id: "b2", title: "Electric bill", amount: 95, dueInDays: 6, category: "Utilities" },
  { id: "b3", title: "Netflix", amount: 15.99, dueInDays: 10, category: "Entertainment" },
  { id: "b4", title: "Gym membership", amount: 39, dueInDays: 14, category: "Health" },
];

export const GUIDES: Guide[] = [
  {
    id: "g1",
    title: "The 50/30/20 Budgeting Rule",
    description: "A simple framework to split your income into needs, wants, and savings.",
    category: "Budgeting",
    difficulty: "Beginner",
    createdAt: daysAgo(3),
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
    body: "Allocate 50% of your after-tax income to essentials, 30% to lifestyle, and 20% to savings and debt paydown. Automate the split on payday and review it monthly to stay on track.",
    benefits: ["Easy to start", "Works at any income level", "Aligns spending with values"],
  },
  {
    id: "g2",
    title: "Emergency Fund Playbook",
    description: "Build a 3-6 month safety net without derailing your other goals.",
    category: "Savings",
    difficulty: "Beginner",
    createdAt: daysAgo(6),
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&auto=format&fit=crop",
    body: "Start with a $1,000 mini-fund, then layer on one month of expenses at a time. Keep it in a high-yield savings account, separate from your daily spending account.",
    benefits: ["Sleep-at-night security", "Avoids high-interest debt", "Bridges income gaps"],
  },
  {
    id: "g3",
    title: "Debt Snowball vs Avalanche",
    description: "Pick the payoff strategy that keeps you motivated and saves on interest.",
    category: "Debt",
    difficulty: "Intermediate",
    createdAt: daysAgo(10),
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    body: "Snowball pays smallest balances first for quick wins. Avalanche pays highest-APR balances first for math-optimal savings. Combine them: knock out one small win, then switch to avalanche.",
    benefits: ["Clear payoff order", "Reduces interest", "Builds momentum"],
  },
  {
    id: "g4",
    title: "Index Fund Investing 101",
    description: "Long-term wealth without stock picking or market timing.",
    category: "Investing",
    difficulty: "Intermediate",
    createdAt: daysAgo(12),
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=800&auto=format&fit=crop",
    body: "Broad-market index funds capture the return of the whole market at rock-bottom fees. Automate monthly contributions, ignore short-term swings, and let compounding do the work.",
    benefits: ["Diversified by default", "Low fees", "Historically strong returns"],
  },
  {
    id: "g5",
    title: "Cutting Subscriptions Without Pain",
    description: "Reclaim $50-$200 a month from services you barely use.",
    category: "Spending",
    difficulty: "Beginner",
    createdAt: daysAgo(14),
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
    body: "List every recurring charge, rank by joy per dollar, and cancel the bottom third. Rotate premium services quarterly instead of stacking them.",
    benefits: ["Instant savings", "Zero lifestyle downgrade", "One-hour audit"],
  },
  {
    id: "g6",
    title: "Sinking Funds for Big Purchases",
    description: "Save for vacations, holidays, and repairs on autopilot.",
    category: "Budgeting",
    difficulty: "Intermediate",
    createdAt: daysAgo(18),
    image: "https://images.unsplash.com/photo-1554224154-26032cdc0e13?w=800&auto=format&fit=crop",
    body: "For each upcoming expense, divide the total by months until due and auto-transfer that amount to a labeled bucket. When the bill lands, it's already funded.",
    benefits: ["No credit-card surprises", "Predictable cash flow", "Guilt-free spending"],
  },
  {
    id: "g7",
    title: "Optimizing Your Tax Refund",
    description: "Adjust withholdings so you keep more of every paycheck.",
    category: "Taxes",
    difficulty: "Advanced",
    createdAt: daysAgo(22),
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    body: "A big refund is an interest-free loan to the government. Use the IRS withholding estimator, update your W-4, and redirect the difference to investments or debt payoff.",
    benefits: ["Bigger monthly cash flow", "Faster goal progress", "Better with compounding"],
  },
  {
    id: "g8",
    title: "Automating Your Money",
    description: "One-time setup that runs your finances for you.",
    category: "Systems",
    difficulty: "Beginner",
    createdAt: daysAgo(26),
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&auto=format&fit=crop",
    body: "Route your paycheck through a hub account. Automate transfers to bills, savings, and investments on payday. What lands in checking is guilt-free spending.",
    benefits: ["Removes willpower", "Prevents overdrafts", "Consistent progress"],
  },
  {
    id: "g9",
    title: "Understanding Your Credit Score",
    description: "The five factors that move your number and how to improve them.",
    category: "Credit",
    difficulty: "Intermediate",
    createdAt: daysAgo(30),
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
    body: "Payment history and utilization drive 65% of your score. Pay on time, keep balances under 30% of limits, and think twice before closing old cards.",
    benefits: ["Lower loan rates", "Better card offers", "Rental approval"],
  },
  {
    id: "g10",
    title: "Retirement Math in 10 Minutes",
    description: "How much you need, how long it takes, and how to get there.",
    category: "Investing",
    difficulty: "Advanced",
    createdAt: daysAgo(35),
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&auto=format&fit=crop",
    body: "Multiply annual expenses by 25 for your FI number. Saving 20% at market returns typically gets you there in ~30 years; 50% cuts that to ~17.",
    benefits: ["Clear finish line", "Motivating milestones", "Actionable savings rate"],
  },
  {
    id: "g11",
    title: "High-Yield Savings vs CDs",
    description: "When to lock up your cash and when to stay liquid.",
    category: "Savings",
    difficulty: "Beginner",
    createdAt: daysAgo(40),
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop",
    body: "HYSAs give near-CD yields with full liquidity. Use CDs only for cash you know you won't touch — sinking funds with a hard date, for example.",
    benefits: ["Better than 0% checking", "Low risk", "FDIC insured"],
  },
  {
    id: "g12",
    title: "Negotiating Your Bills",
    description: "Scripts and timing to lower internet, phone, and insurance.",
    category: "Spending",
    difficulty: "Intermediate",
    createdAt: daysAgo(45),
    image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800&auto=format&fit=crop",
    body: "Call retention, cite a competitor's price, and ask what they can do. A polite 10-minute call can save $200+ per year on a single line item.",
    benefits: ["Immediate savings", "No downgrade in service", "Repeatable yearly"],
  },
];
