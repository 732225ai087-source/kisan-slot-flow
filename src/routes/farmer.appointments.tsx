import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { AppShell } from "@/components/kq/AppShell";
import { farmerNav } from "@/components/kq/navs";
import {
  PageTitle,
  RoleGuard,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESCHEDULE_REASONS, formatDate, iso } from "@/lib/kq/demo-data";
import { useKQ } from "@/lib/kq/store";

export const Route = createFileRoute("/farmer/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments — KISANQUEUE" },
      {
        name: "description",
        content:
          "See your procurement appointments, token numbers, estimated waiting time and request a new date if you cannot attend.",
      },
      { property: "og:title", content: "My Appointments — KISANQUEUE" },
      {
        property: "og:description",
        content: "Procurement appointment tokens and rescheduling.",
      },
    ],
  }),
  component: () => (
    <RoleGuard role="farmer">
      <FarmerAppointments />
    </RoleGuard>
  ),
});

function FarmerAppointments() {
  const {
    session,
    appointments,
    products,
    centres,
    reschedules,
    createReschedule,
  } = useKQ();
  const farmerId = session!.farmerId!;
  const mine = appointments
    .filter((a) => a.farmerId === farmerId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const [openFor, setOpenFor] = useState<string | null>(null);
  const [form, setForm] = useState({
    reason: RESCHEDULE_REASONS[0]!,
    explanation: "",
    requestedDate: iso(7),
    proofName: "",
  });

  const submit = (appointmentId: string) => {
    if (form.explanation.trim().length < 10) {
      toast.error("Please explain your reason (at least 10 characters)");
      return;
    }
    createReschedule({
      appointmentId,
      farmerId,
      reason: form.reason,
      explanation: form.explanation.trim().slice(0, 500),
      proofName: form.proofName,
      requestedDate: form.requestedDate,
    });
    setOpenFor(null);
    toast.success("Reschedule request submitted — waiting for officer approval");
  };

  return (
    <AppShell nav={farmerNav} roleLabel="Farmer Portal">
      <PageTitle
        title="Procurement Appointments"
        description="Your allotted slots, tokens and reschedule requests"
      />

      {mine.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="p-10 text-center text-muted-foreground">
            <CalendarClock className="mx-auto size-8 text-primary" />
            <p className="mt-3">No appointments yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {mine.map((a) => {
          const product = products.find((p) => p.id === a.productId);
          const centre = centres.find((c) => c.id === a.centreId);
          const rs = reschedules.find((r) => r.appointmentId === a.id);
          const ahead = appointments.filter(
            (x) =>
              x.centreId === a.centreId &&
              x.date === a.date &&
              x.timeSlot < a.timeSlot &&
              x.queueStatus !== "Completed",
          ).length;
          return (
            <Card key={a.id} className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-wrap items-center gap-3 text-lg">
                  {a.token}
                  <StatusBadge status={a.status} />
                  {a.date === iso(0) && (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                      Today
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-[1fr_auto]">
                <div>
                  <dl className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Appointment ID", a.id],
                      ["Product", product?.name ?? "-"],
                      ["Quantity", `${a.quantityQtl} Quintals`],
                      ["Centre", centre?.name ?? "-"],
                      ["Date", formatDate(a.date)],
                      ["Time Slot", a.timeSlot],
                      ["Queue Status", a.queueStatus],
                      [
                        "Estimated Waiting Time",
                        a.status === "Completed"
                          ? "-"
                          : `${estimateWait(ahead)} min (estimated)`,
                      ],
                      ["Farmers Ahead", a.status === "Completed" ? "-" : ahead],
                    ].map(([k, v]) => (
                      <div key={String(k)}>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          {k}
                        </dt>
                        <dd className="text-sm font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {rs && (
                    <div className="mt-4 rounded-md border bg-muted p-3 text-sm">
                      <p className="font-semibold">
                        Reschedule request: {rs.status === "Pending" ? "Waiting for Officer Approval" : rs.status}
                      </p>
                      <p className="text-muted-foreground">
                        {rs.reason} · requested {formatDate(rs.requestedDate)}
                      </p>
                      {rs.officerRemarks && (
                        <p className="mt-1 text-muted-foreground">
                          Officer remarks: {rs.officerRemarks}
                        </p>
                      )}
                    </div>
                  )}

                  {a.status !== "Completed" && a.status !== "Reschedule Requested" && (
                    <Dialog
                      open={openFor === a.id}
                      onOpenChange={(o) => setOpenFor(o ? a.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="mt-4">
                          Unable to Attend? Request New Date
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request a New Date</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Reason for Rescheduling</Label>
                            <Select
                              value={form.reason}
                              onValueChange={(v) => setForm({ ...form, reason: v })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {RESCHEDULE_REASONS.map((r) => (
                                  <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Additional Explanation</Label>
                            <Textarea
                              rows={3}
                              maxLength={500}
                              placeholder="I cannot attend the procurement appointment because of heavy rain and transportation issues."
                              value={form.explanation}
                              onChange={(e) =>
                                setForm({ ...form, explanation: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Requested New Date</Label>
                            <Input
                              type="date"
                              value={form.requestedDate}
                              onChange={(e) =>
                                setForm({ ...form, requestedDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Supporting Document / Photo (optional)</Label>
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  proofName: e.target.files?.[0]?.name ?? "",
                                })
                              }
                            />
                          </div>
                          <Button size="lg" className="w-full" onClick={() => submit(a.id)}>
                            Submit Reschedule Request
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                  <QRCodeSVG value={a.token} size={120} />
                  <p className="text-xs text-muted-foreground">Verification QR</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
