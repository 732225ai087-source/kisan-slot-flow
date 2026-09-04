import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKQ } from "@/lib/kq/store";
import type { Role } from "@/lib/kq/types";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (["farmer", "officer", "admin"] as const).includes(
      search["role"] as Role,
    )
      ? (search["role"] as Role)
      : ("farmer" as Role),
  }),
  head: () => ({
    meta: [
      { title: "Login — KISANQUEUE" },
      {
        name: "description",
        content:
          "Farmer, procurement officer and admin login for the KISANQUEUE procurement scheduling platform.",
      },
      { property: "og:title", content: "Login — KISANQUEUE" },
      {
        property: "og:description",
        content: "Role-based sign in for farmers, officers and administrators.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useSearch();
  const { farmers, login } = useKQ();
  const navigate = useNavigate();
  const [farmerId, setFarmerId] = useState(farmers[0]?.id ?? "");
  const [mobile, setMobile] = useState("");

  const signIn = (r: Role) => {
    if (r === "farmer") {
      const f = farmers.find((x) => x.id === farmerId);
      if (!f) {
        toast.error("Select a farmer account");
        return;
      }
      login("farmer", f.id, f.name);
      toast.success(`Welcome ${f.name}`);
      void navigate({ to: "/farmer/dashboard" });
    } else {
      login(r);
      toast.success(`Signed in as ${r}`);
      void navigate({ to: r === "officer" ? "/officer/dashboard" : "/admin/dashboard" });
    }
  };

  return (
    <div className="soft-panel flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sprout className="size-5" />
        </span>
        <span className="text-xl font-bold">KISANQUEUE</span>
      </Link>
      <Card className="w-full max-w-md card-elevated">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Demo login — no password is verified in this prototype.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={role}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              <TabsTrigger value="officer">Officer</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="farmer" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Registered mobile number</Label>
                <Input
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Demo farmer account</Label>
                <Select value={farmerId} onValueChange={setFarmerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name} · {f.village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" size="lg" onClick={() => signIn("farmer")}>
                Login as Farmer
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                New farmer?{" "}
                <Link to="/register" className="font-semibold text-primary underline">
                  Register here
                </Link>
              </p>
            </TabsContent>

            <TabsContent value="officer" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Officer ID</Label>
                <Input defaultValue="OFF-TNJ-001" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" defaultValue="demo1234" />
              </div>
              <Button className="w-full" size="lg" onClick={() => signIn("officer")}>
                Login as Procurement Officer
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Admin ID</Label>
                <Input defaultValue="ADM-STATE-01" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" defaultValue="demo1234" />
              </div>
              <Button className="w-full" size="lg" onClick={() => signIn("admin")}>
                Login as Admin
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
