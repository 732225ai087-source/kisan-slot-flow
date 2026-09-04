import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  ClipboardList,
  FileCheck2,
  ListOrdered,
  QrCode,
  ShieldCheck,
  Sprout,
  Timer,
  TrendingDown,
  Users,
} from "lucide-react";
import heroImage from "@/assets/kisanqueue-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/kq/AppShell";
import { useT } from "@/lib/kq/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KISANQUEUE — Smart Farmer Procurement & Appointments" },
      {
        name: "description",
        content:
          "Register once, book a procurement slot and get a digital queue token. KISANQUEUE cuts farmer waiting time at government procurement centres.",
      },
      { property: "og:title", content: "KISANQUEUE — Smart Farmer Procurement" },
      {
        property: "og:description",
        content:
          "Digital registration, appointment scheduling and smart queue management for procurement centres.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  "Farmer registers",
  "Adds crop & quantity",
  "Officer reviews request",
  "Procurement slot assigned",
  "Farmer receives token",
  "Farmer visits centre",
  "Digital verification",
  "Procurement completed",
];

const BENEFITS = [
  { icon: TrendingDown, title: "Reduced waiting time", text: "From 4-6 hours to 30-60 minutes." },
  { icon: ListOrdered, title: "Better queue management", text: "Token-based digital queue with live status." },
  { icon: ShieldCheck, title: "Transparent scheduling", text: "Capacity-aware slots, no overbooking." },
  { icon: Users, title: "Reduced overcrowding", text: "Farmers arrive only in their allotted slot." },
  { icon: ClipboardList, title: "Better planning", text: "Centre-wise, crop-wise procurement forecasting." },
  { icon: FileCheck2, title: "Digital records", text: "Receipts, history and audit trail for every farmer." },
  { icon: Clock, title: "Easy rescheduling", text: "Request a new date with a reason and proof." },
  { icon: QrCode, title: "Real-time monitoring", text: "QR verification and live centre dashboards." },
];

function Landing() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </span>
          <div className="leading-none">
            <p className="text-base font-bold tracking-tight">{t("appName")}</p>
            <p className="text-[11px] text-muted-foreground">
              Government of Tamil Nadu · Prototype
            </p>
          </div>
          <nav className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="gov-hero text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Smart India Hackathon 2026 Prototype
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              {t("appName")}
            </h1>
            <p className="mt-3 text-lg font-medium opacity-95">{t("tagline")}</p>
            <p className="mt-4 max-w-xl text-base opacity-90">{t("heroSub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link to="/register">{t("registerFarmer")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/login" search={{ role: "officer" }}>
                  {t("officerLogin")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/login" search={{ role: "admin" }}>
                  {t("adminLogin")}
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center">
              {[
                { k: "4-6 hrs", v: "Waiting before" },
                { k: "30-60 min", v: "Waiting with KISANQUEUE" },
                { k: "5 centres", v: "In this demo" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg bg-primary-foreground/12 px-3 py-3"
                >
                  <p className="text-lg font-bold">{s.k}</p>
                  <p className="text-[11px] opacity-90">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <img
            src={heroImage}
            alt="Farmer registering online and receiving a procurement slot at a government centre"
            width={1280}
            height={960}
            className="w-full rounded-xl bg-card object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="soft-panel border-b">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-2">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold">{t("problem")}</h2>
              <p className="mt-2 text-muted-foreground">
                Farmers reach government procurement centres before sunrise and
                spend 4-6 hours waiting. There is no visibility of centre
                capacity, no fixed turn, and repeated trips when the day's
                quota is full.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>· Long unmanaged physical queues and overcrowding</li>
                <li>· No advance information about daily capacity</li>
                <li>· Lost working days and transport cost for farmers</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="card-elevated border-primary/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold">{t("solution")}</h2>
              <p className="mt-2 text-muted-foreground">
                KISANQUEUE digitises the whole journey: one-time farmer
                registration, crop and quantity declaration, capacity-aware slot
                allocation, a digital token and a live queue at the centre.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>· Appointment slots limited by real centre capacity</li>
                <li>· Digital token with estimated waiting time</li>
                <li>· Easy rescheduling with officer approval</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold">{t("howItWorks")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className="rounded-lg border bg-card p-4 card-elevated"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="soft-panel border-y">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-bold">{t("benefits")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <Card key={b.title} className="card-elevated">
                <CardContent className="p-5">
                  <b.icon className="size-6 text-primary" />
                  <p className="mt-3 font-semibold">{b.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <Card className="card-elevated overflow-hidden">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Timer className="size-6 text-primary" />
                Ready to skip the queue?
              </h2>
              <p className="mt-1 text-muted-foreground">
                Register your farm once and book procurement slots any time.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/register">{t("registerFarmer")}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">KISANQUEUE</p>
          <p className="mt-1">
            SIH 2026 prototype. All data shown is simulated demo data and does
            not contain real personal information.
          </p>
        </div>
      </footer>
    </div>
  );
}
