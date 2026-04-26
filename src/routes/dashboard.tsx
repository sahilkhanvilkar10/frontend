import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { SummaryCards } from "@/components/SummaryCards";
import { FilterTabs, type FilterKey } from "@/components/FilterTabs";
import { EmptyState } from "@/components/EmptyState";
import { getSubscriptions } from "@/lib/api";
import type { Subscription } from "@/lib/types";

const USER_ID = "11111111-1111-1111-1111-111111111111";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — ShadowSpend" },
      { name: "description", content: "Track your subscriptions with ShadowSpend." },
    ],
  }),
});

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
      <div className="mb-3 h-5 w-32 animate-pulse rounded bg-white/10" />
      <div className="mb-4 h-4 w-20 animate-pulse rounded bg-white/10" />
      <div className="mb-4 h-7 w-24 animate-pulse rounded bg-white/10" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

function DashboardPage() {
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getSubscriptions(USER_ID)
      .then((data) => {
        if (!cancelled) setSubs(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!subs) return [];
    if (filter === "ALL") return subs;
    return subs.filter((s) => (s.classification || "").toUpperCase() === filter);
  }, [subs, filter]);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0f172a" }}>
      <Sidebar />
      <main className="ml-60 h-screen overflow-y-auto p-8">
        <h2 className="mb-2 text-3xl font-bold">Overview</h2>
        <p className="mb-8 text-sm text-gray-400">Your detected subscriptions.</p>

        <SummaryCards subs={subs} />

        <FilterTabs active={filter} onChange={setFilter} />

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-500/10 p-6 ring-1 ring-red-500/30">
            <p className="font-semibold text-red-400">Failed to load subscriptions</p>
            <p className="mt-1 text-sm text-red-300/80">{error}</p>
          </div>
        )}

        {!loading && !error && subs && filtered.length === 0 && <EmptyState />}

        {!loading && !error && subs && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SubscriptionCard key={s.id} sub={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}