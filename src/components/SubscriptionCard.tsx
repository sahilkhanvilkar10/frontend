import type { Subscription } from "@/lib/types";

function classificationStyle(classification: string): string {
  const c = classification.toUpperCase();
  if (c === "CONFIRMED") return "bg-green-500/20 text-green-400";
  if (c === "LIKELY") return "bg-yellow-500/20 text-yellow-400";
  if (c === "POSSIBLE") return "bg-blue-500/20 text-blue-400";
  return "bg-gray-500/20 text-gray-300";
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function SubscriptionCard({ sub }: { sub: Subscription }) {
  return (
    <div className="rounded-xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-white">{sub.merchantName}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${classificationStyle(sub.classification)}`}
        >
          {sub.classification}
        </span>
      </div>
      <p className="mb-1 text-sm text-gray-400">{sub.category}</p>
      <p className="mb-4 text-2xl font-semibold text-white">
        ₹{sub.amount.toLocaleString("en-IN")}
      </p>
      <div className="space-y-1 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Billing</span>
          <span className="text-gray-200 capitalize">{sub.billingCycle}</span>
        </div>
        <div className="flex justify-between">
          <span>Next billing</span>
          <span className="text-gray-200">{formatDate(sub.nextBillingDate)}</span>
        </div>
      </div>
    </div>
  );
}