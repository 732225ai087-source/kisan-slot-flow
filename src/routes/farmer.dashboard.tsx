import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  MapPin,
  Package,
  Pencil,
  Timer,
} from "lucide-react";
import { AppShell } from "@/components/kq/AppShell";
import { farmerNav } from "@/components/kq/navs";
import {
  DemoNote,
  PageTitle,
  RoleGuard,
  StatCard,
  StatusBadge,
  estimateWait,
} from "@/components/kq/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, iso } from "@/lib/kq/demo-data";
import { useKQ } from "@/lib/kq/store";

export const Route = createFileRoute("/farmer/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — KISANQUEUE" },
      {
        name: "description",
        content:
          "View your farm profile, upcoming procurement appointment, token number and estimated waiting time.",
      },
      { property: "og:title", content: "Farmer Dashboard — KISANQUEUE" },
      {
        property: "og:description",
        content: "Your procurement slots, tokens and reminders in one place.",
      },
    ],
  }),
  component: () => (
    <RoleGuard role="farmer">
      <FarmerDashboard />
    </RoleGuard>
  ),
});

function FarmerDashboard() {
  const {
    session,
    farmers,
    products,
    appointments,
    requests,
    records,
    centres,
    updateFarmer,
  } = useKQ();
  const farmer = farmers.find((f) => f.id === session?.farmerId)!;
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(farmer);

  const myProducts = products.filter((p) => p.farmerId === farmer.id);
  const myAppointments = appointments.filter((a) => a.farmerId === farmer.id);
  const myRequests = requests.filter((r) => r.farmerId === farmer.id);
  const myRecords = records.filter((r) => r.farmerId === farmer.id);
  const upcoming = myAppointments
    .filter((a) => a.date >= iso(0) && a.status !== "Completed")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const centre = centres.find((c) => c.id === upcoming?.centreId);
  const product = products.find((p) => p.id === upcoming?.productId);
  const ahead = upcoming
    ? appointments.filter(
        (a) =>
          a.centreId === upcoming.centreId &&
          a.date === upcoming.date &&
          a.timeSlot < upcoming.timeSlot &&
          a.queueStatus !== "Completed",
      ).length
    : 0;

  return (
    <AppShell nav={farmerNav} roleLabel="Farmer Portal">
      <PageTitle
        title={`Vanakkam, ${farmer.name}`}
        description="Your procurement appointments and farm details"
        action={<DemoNote>Simulated demo data</DemoNote>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Products"
          value={myProducts.length}
          icon={<Package className="size-5" />}
          tone="primary"
        />
        <StatCard
          label="Pending Requests"
          value={myRequests.filter((r) => r.status === "Pending Officer Review").length}
          icon={<ClipboardList className="size-5" />}
        />
        <StatCard
          label="Upcoming Appointments"
          value={myAppointments.filter((a) => a.date >= iso(0) && a.status !== "Completed").length}
          icon={<CalendarCheck className="size-5" />}
          tone="accent"
        />
        <StatCard
          label="Completed Procurements"
          value={myRecords.length}
          icon={<Clock className="size-5" />}
        />
      </div>

      {upcoming && (
        <Card className="mt-6 border-primary/40 card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2">
              <Timer className="size-5 text-primary" />
              {upcoming.date === iso(1)
                ? "Your procurement appointment is tomorrow"
                : "Your next procurement appointment"}
              <StatusBadge status={upcoming.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[1fr_auto]">
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Appointment ID", upcoming.id],
                ["Token Number", upcoming.token],
                ["Product", product?.name ?? "-"],
                ["Quantity", `${upcoming.quantityQtl} Quintals`],
                ["Centre", centre?.name ?? "-"],
                ["Date", formatDate(upcoming.date)],
                ["Time Slot", upcoming.timeSlot],
                [
                  "Estimated Waiting Time",
                  `${estimateWait(ahead)} minutes (estimated)`,
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4">
              <QRCodeSVG value={upcoming.token} size={132} />
              <p className="text-xs text-muted-foreground">
                Show this QR at the centre
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="card-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Farmer Profile</CardTitle>
            <Dialog open={edit} onOpenChange={(o) => { setEdit(o); setDraft(farmer); }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="size-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["name", "Farmer Name"],
                      ["mobile", "Mobile Number"],
                      ["village", "Village"],
                      ["taluk", "Taluk"],
                      ["district", "District"],
                      ["surveyNo", "Survey Number"],
                      ["landArea", "Land Area"],
                      ["address", "Address"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input
                        value={String(draft[key] ?? "")}
                        onChange={(e) =>
                          setDraft({ ...draft, [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    updateFarmer(farmer.id, draft);
                    setEdit(false);
                    toast.success("Profile updated");
                  }}
                >
                  Save changes
                </Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Farmer Name", farmer.name],
                ["Registered Mobile", farmer.mobile],
                ["Village", farmer.village],
                ["Taluk", farmer.taluk],
                ["District", farmer.district],
                ["Survey Number", farmer.surveyNo],
                ["Land Area", farmer.landArea],
                ["ID Reference", farmer.idRefMasked],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-start gap-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {farmer.address}
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Average Waiting Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase text-muted-foreground">
                Before digital system
              </p>
              <p className="text-2xl font-bold text-destructive">4-6 Hours</p>
            </div>
            <div className="rounded-lg border border-primary/40 bg-secondary p-4">
              <p className="text-xs uppercase text-muted-foreground">
                With KISANQUEUE
              </p>
              <p className="text-2xl font-bold text-primary">30-60 Minutes</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Figures are simulated for demonstration purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
