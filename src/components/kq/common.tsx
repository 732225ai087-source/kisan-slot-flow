import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useKQ } from "@/lib/kq/store";
import type { Role } from "@/lib/kq/types";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "accent";
}) {
  return (
    <Card className="card-elevated">
      <CardContent className="flex items-start gap-3 p-4">
        {icon && (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md",
              tone === "primary"
                ? "bg-primary text-primary-foreground"
                : tone === "accent"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground",
            )}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold leading-tight">{value}</p>
          {hint && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const TONES: Record<string, string> = {
  Waiting: "bg-secondary text-secondary-foreground",
  Called: "bg-accent text-accent-foreground",
  "Document Verification": "bg-accent text-accent-foreground",
  "Quality Check": "bg-accent text-accent-foreground",
  Weighing: "bg-accent text-accent-foreground",
  "Procurement Processing": "bg-accent text-accent-foreground",
  Completed: "bg-primary text-primary-foreground",
  Approved: "bg-primary text-primary-foreground",
  Confirmed: "bg-primary text-primary-foreground",
  Scheduled: "bg-primary/85 text-primary-foreground",
  Rescheduled: "bg-primary/70 text-primary-foreground",
  Pending: "bg-secondary text-secondary-foreground",
  "Pending Officer Review": "bg-secondary text-secondary-foreground",
  "Reschedule Requested": "bg-accent text-accent-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
  Cancelled: "bg-destructive text-destructive-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <Badge variant="outline" className="font-normal">
      {children}
    </Badge>
  );
}

export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { session } = useKQ();
  const navigate = useNavigate();
  const ok = session?.role === role;
  useEffect(() => {
    if (!ok) void navigate({ to: "/login" });
  }, [ok, navigate]);
  if (!ok) return null;
  return <>{children}</>;
}

/** Demo estimate: farmers ahead x avg processing time / active counters. */
export function estimateWait(
  farmersAhead: number,
  avgMinutes = 12,
  counters = 2,
) {
  return Math.max(5, Math.round((farmersAhead * avgMinutes) / counters));
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]!);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
