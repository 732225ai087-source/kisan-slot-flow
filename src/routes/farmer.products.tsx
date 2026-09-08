import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Sprout } from "lucide-react";
import { AppShell } from "@/components/kq/AppShell";
import { farmerNav } from "@/components/kq/navs";
import {
  PageTitle,
  RoleGuard,
  StatusBadge,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CROPS,
  CROP_CATEGORIES,
  GRADES,
  formatDate,
  iso,
} from "@/lib/kq/demo-data";
import { useKQ } from "@/lib/kq/store";
import type { Unit } from "@/lib/kq/types";

export const Route = createFileRoute("/farmer/products")({
  head: () => ({
    meta: [
      { title: "My Procurement Products — KISANQUEUE" },
      {
        name: "description",
        content:
          "Add your crops, quantity and harvest details, then request a government procurement slot.",
      },
      { property: "og:title", content: "My Procurement Products — KISANQUEUE" },
      {
        property: "og:description",
        content: "Declare crops and request procurement slots online.",
      },
    ],
  }),
  component: () => (
    <RoleGuard role="farmer">
      <FarmerProducts />
    </RoleGuard>
  ),
});

const toQuintal = (qty: number, unit: Unit) =>
  unit === "Kg" ? qty / 100 : unit === "Ton" ? qty * 10 : qty;

function FarmerProducts() {
  const {
    session,
    products,
    centres,
    appointments,
    requests,
    addProduct,
    createRequest,
    bookedCapacity,
    nextAvailableDate,
  } = useKQ();
  const farmerId = session!.farmerId!;
  const mine = products.filter((p) => p.farmerId === farmerId);

  const [open, setOpen] = useState(false);
  const [slotFor, setSlotFor] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: CROPS[0]!,
    category: CROP_CATEGORIES[0]!,
    variety: "",
    quantity: "",
    unit: "Quintal" as Unit,
    harvestDate: iso(-3),
    expectedProcurementDate: iso(4),
    grade: GRADES[0]!,
    storage: "",
    documentName: "",
    imageName: "",
  });

  const [slot, setSlot] = useState({
    centreId: centres[0]!.id,
    quantity: "",
    date: iso(2),
  });

  const save = () => {
    const qty = Number(form.quantity);
    if (!form.variety.trim() || !qty || qty <= 0) {
      toast.error("Enter variety and a valid quantity");
      return;
    }
    addProduct({
      farmerId,
      name: form.name,
      category: form.category,
      variety: form.variety.trim(),
      quantity: qty,
      unit: form.unit,
      harvestDate: form.harvestDate,
      expectedProcurementDate: form.expectedProcurementDate,
      grade: form.grade,
      storage: form.storage.trim(),
      documentName: form.documentName,
      imageName: form.imageName,
    });
    setOpen(false);
    toast.success("Product added to your procurement list");
  };

  const submitSlot = () => {
    const product = products.find((p) => p.id === slotFor);
    if (!product) return;
    const qtl = Number(slot.quantity);
    if (!qtl || qtl <= 0) {
      toast.error("Enter a valid quantity in quintals");
      return;
    }
    const centre = centres.find((c) => c.id === slot.centreId)!;
    const remaining = centre.dailyCapacity - bookedCapacity(centre.id, slot.date);
    if (qtl > remaining) {
      const next = nextAvailableDate(centre.id, slot.date, qtl);
      toast.error(
        `Insufficient capacity for selected date (${remaining} Qtl left). ${
          next ? `Suggested next available date: ${formatDate(next)}.` : ""
        }`,
      );
      return;
    }
    createRequest({
      farmerId,
      productId: product.id,
      centreId: centre.id,
      quantityQtl: qtl,
      preferredDate: slot.date,
    });
    setSlotFor(null);
    toast.success("Procurement slot requested — pending officer review");
  };

  const statusOf = (productId: string) => {
    const appt = appointments.find(
      (a) => a.productId === productId && a.farmerId === farmerId,
    );
    if (appt) return { label: appt.status, appt };
    const req = requests.find(
      (r) => r.productId === productId && r.farmerId === farmerId,
    );
    return { label: req?.status ?? "Not requested", appt: undefined };
  };

  return (
    <AppShell nav={farmerNav} roleLabel="Farmer Portal">
      <PageTitle
        title="My Procurement Products"
        description="Add the crops you want to sell at a government procurement centre"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="size-5" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Crop / Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Crop / Product Name</Label>
                  <Select
                    value={form.name}
                    onValueChange={(v) => setForm({ ...form, name: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CROPS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Crop Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CROP_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Variety</Label>
                  <Input
                    value={form.variety}
                    onChange={(e) => setForm({ ...form, variety: e.target.value })}
                    placeholder="e.g. ADT 45"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Quantity</Label>
                  <Input
                    inputMode="decimal"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity Unit</Label>
                  <Select
                    value={form.unit}
                    onValueChange={(v) => setForm({ ...form, unit: v as Unit })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Kg", "Quintal", "Ton"].map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality / Grade</Label>
                  <Select
                    value={form.grade}
                    onValueChange={(v) => setForm({ ...form, grade: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GRADES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Harvest Date</Label>
                  <Input
                    type="date"
                    value={form.harvestDate}
                    onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Procurement Date</Label>
                  <Input
                    type="date"
                    value={form.expectedProcurementDate}
                    onChange={(e) =>
                      setForm({ ...form, expectedProcurementDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Storage Location</Label>
                  <Input
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    placeholder="e.g. Farm godown, Vallam"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supporting Document</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        documentName: e.target.files?.[0]?.name ?? "",
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Image (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        imageName: e.target.files?.[0]?.name ?? "",
                      })
                    }
                  />
                </div>
              </div>
              <Button size="lg" onClick={save}>Save Product</Button>
            </DialogContent>
          </Dialog>
        }
      />

      {mine.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Sprout className="mx-auto size-8 text-primary" />
            <p className="mt-3">No products added yet. Add your first crop.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mine.map((p) => {
          const s = statusOf(p.id);
          const centre = centres.find((c) => c.id === s.appt?.centreId);
          const ahead = s.appt
            ? appointments.filter(
                (a) =>
                  a.centreId === s.appt!.centreId &&
                  a.date === s.appt!.date &&
                  a.timeSlot < s.appt!.timeSlot,
              ).length
            : 0;
          return (
            <Card key={p.id} className="card-elevated">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                  {p.name}
                  <StatusBadge status={s.label} />
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {p.variety} · {p.category} · {p.grade}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Quantity</dt>
                    <dd className="font-semibold">{p.quantity} {p.unit}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Harvest date</dt>
                    <dd className="font-semibold">{formatDate(p.harvestDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Centre</dt>
                    <dd className="font-semibold">{centre?.name ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Appointment</dt>
                    <dd className="font-semibold">
                      {s.appt ? `${formatDate(s.appt.date)} · ${s.appt.timeSlot}` : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Token</dt>
                    <dd className="font-semibold">{s.appt?.token ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Queue position</dt>
                    <dd className="font-semibold">{s.appt ? ahead + 1 : "-"}</dd>
                  </div>
                </dl>
                {!s.appt && s.label !== "Pending Officer Review" && (
                  <Dialog
                    open={slotFor === p.id}
                    onOpenChange={(o) => {
                      setSlotFor(o ? p.id : null);
                      if (o)
                        setSlot({
                          centreId: centres[0]!.id,
                          quantity: String(toQuintal(p.quantity, p.unit)),
                          date: p.expectedProcurementDate,
                        });
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Request Procurement Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Procurement Slot</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Procurement Centre</Label>
                          <Select
                            value={slot.centreId}
                            onValueChange={(v) => setSlot({ ...slot, centreId: v })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {centres.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Product</Label>
                          <Input value={`${p.name} (${p.variety})`} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity (Quintals)</Label>
                          <Input
                            inputMode="decimal"
                            value={slot.quantity}
                            onChange={(e) =>
                              setSlot({ ...slot, quantity: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Date</Label>
                          <Input
                            type="date"
                            value={slot.date}
                            onChange={(e) => setSlot({ ...slot, date: e.target.value })}
                          />
                        </div>
                        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                          Remaining capacity on {formatDate(slot.date)}:{" "}
                          <strong>
                            {(centres.find((c) => c.id === slot.centreId)?.dailyCapacity ?? 0) -
                              bookedCapacity(slot.centreId, slot.date)}{" "}
                            Quintals
                          </strong>
                        </p>
                        <Button size="lg" className="w-full" onClick={submitSlot}>
                          Submit Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
