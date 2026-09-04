import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Languages, LogOut, Menu, Sprout } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKQ } from "@/lib/kq/store";
import { LANG_LABELS, useT } from "@/lib/kq/i18n";
import type { Lang } from "@/lib/kq/types";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
}

export function LanguageSwitcher() {
  const { lang, setLang } = useKQ();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="size-4" />
          <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLang(l)}>
            {LANG_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell() {
  const { notifications, session, markRead } = useKQ();
  const mine = notifications.filter((n) =>
    session?.role === "farmer"
      ? n.farmerId === session.farmerId || n.role === "all"
      : n.role === session?.role || n.role === "all",
  );
  const unread = mine.filter((n) => !n.read).length;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 overflow-y-auto px-4 pb-6">
          {mine.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notifications yet.
            </p>
          )}
          {mine.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                n.read ? "bg-card" : "bg-secondary",
              )}
            >
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.createdAt}</p>
            </button>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            SMS / WhatsApp delivery uses a placeholder service in this
            prototype.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AppShell({
  nav,
  children,
  roleLabel,
}: {
  nav: NavItem[];
  children: ReactNode;
  roleLabel: string;
}) {
  const { session, logout } = useKQ();
  const t = useT();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const links = (
    <>
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.to
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sprout className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">
                {t("appName")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {roleLabel}
              </span>
            </span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 lg:flex">{links}</nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <NotificationBell />
            {session && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  logout();
                  void navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </Button>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>{roleLabel}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">{links}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>KISANQUEUE · SIH 2026 Prototype · Simulated demo data</p>
          <Badge variant="outline">Government Digital Service Prototype</Badge>
        </div>
      </footer>
    </div>
  );
}
