import type { Subscription } from "@/lib/types";
import type { Insights } from "@/lib/api";
import { Wallet, CalendarClock, ListChecks, HelpCircle } from "lucide-react";

function isWithinNext7Days(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date).getTime();
  if (Number.isNaN(d)) return false;
  const now = Date.now();
  return d >= now && d <= now + 7 * 24 * 60 * 60 * 1000;
}

function monthlyAmount(sub: Subscription): number {
  const cycle = (sub.billingCycle || "").toLowerCase();
  if (cycle === "yearly" || cycle === "annual") return sub.amount / 12;
  if (cycle === "weekly") return sub.amount * 4;
  return sub.amount;
}

export function SummaryCards({
  subs,
  insights,
}: {
  subs: Subscription[] | null;
  insights?: Insights | null;
}) {
  const list = subs ?? [];
  const totalMonthly = insights
    ? insights.totalMonthlySpend
    : list.reduce((acc, s) => acc + monthlyAmount(s), 0);
  const upcoming = insights
    ? insights.upcomingThisWeek
    : list.filter((s) => isWithinNext7Days(s.nextBillingDate)).length;
  const active = insights
    ? insights.activeSubscriptions
    : list.filter((s) => s.isActive).length;
  const unknown = insights
    ? insights.unknownCharges
    : list.filter((s) => (s.classification || "").toUpperCase() === "UNKNOWN").length;

  const cards = [
    {
      label: "Total Monthly Spend",
      value: `₹${Math.round(totalMonthly).toLocaleString("en-IN")}`,
      icon: Wallet,
    },
    { label: "Upcoming This Week", value: `${upcoming} items`, icon: CalendarClock },
    { label: "Active Subscriptions", value: `${active} items`, icon: ListChecks },
    { label: "Unknown Charges", value: `${unknown} items`, icon: HelpCircle },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="animate-fade-rise rounded-xl p-5 shadow-md ring-1 ring-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{ backgroundColor: "#111827", animationDelay: `${i * 60}ms` }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {c.label}
            </span>
            <c.icon className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{c.value}</p>
        </div>
      ))}
    </div>
  );
}