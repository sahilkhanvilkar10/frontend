import { Inbox } from "lucide-react";

export function EmptyState({ onScan }: { onScan?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl py-16 text-center ring-1 ring-white/5"
      style={{ backgroundColor: "#111827" }}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
        <Inbox className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-white">No subscriptions detected yet</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-400">
        Run a scan to discover recurring charges from your emails
      </p>
      <button
        onClick={onScan}
        className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97]"
      >
        Scan Emails
      </button>
    </div>
  );
}