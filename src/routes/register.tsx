import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS } from "@/lib/kq/demo-data";
import { useKQ } from "@/lib/kq/store";
import type { Lang } from "@/lib/kq/types";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Farmer Registration — KISANQUEUE" },
      {
        name: "description",
        content:
          "Register your farm details once on KISANQUEUE and book government procurement slots without waiting in long queues.",
      },
      { property: "og:title", content: "Farmer Registration — KISANQUEUE" },
      {
        property: "og:description",
        content: "One-time farmer registration with mobile verification.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(3, "Enter your full name").max(100),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Invalid email").max(255).or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  idRef: z.string().trim().regex(/^\d{12}$/, "Enter the 12-digit ID reference number"),
  district: z.string().min(1, "Select a district"),
  taluk: z.string().trim().min(2, "Enter taluk").max(60),
  village: z.string().trim().min(2, "Enter village").max(60),
  surveyNo: z.string().trim().min(1, "Enter survey number").max(30),
  landArea: z.string().trim().min(1, "Enter land area").max(30),
  address: z.string().trim().min(5, "Enter address").max(300),
});

function RegisterPage() {
  const { registerFarmer } = useKQ();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [lang, setLang] = useState<Lang>("en");
  const [district, setDistrict] = useState(DISTRICTS[0]!);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    idRef: "",
    taluk: "",
    village: "",
    surveyNo: "",
    landArea: "",
    address: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const result = schema.safeParse({ ...form, district });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues)
        errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      toast.error("Please correct the highlighted fields");
      return;
    }
    setErrors({});
    setStep("otp");
    toast.success("OTP sent to your mobile number (demo OTP: 123456)");
  };

  const verify = () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    const data = schema.parse({ ...form, district });
    registerFarmer({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      district: data.district,
      taluk: data.taluk,
      village: data.village,
      surveyNo: data.surveyNo,
      landArea: data.landArea,
      language: lang,
      address: data.address,
      idRef: data.idRef,
    });
    toast.success("Registration successful");
    void navigate({ to: "/farmer/dashboard" });
  };

  const field = (
    key: keyof typeof form,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        {...props}
      />
      {errors[key] && (
        <p className="text-xs font-medium text-destructive">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <div className="soft-panel min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sprout className="size-5" />
          </span>
          <span className="text-xl font-bold">KISANQUEUE</span>
        </Link>

        {step === "form" ? (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-2xl">Farmer Registration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill your details once. Your ID number is stored masked and is
                never displayed again.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {field("name", "Farmer Name")}
              {field("mobile", "Mobile Number", { inputMode: "numeric", maxLength: 10 })}
              {field("email", "Email (optional)", { type: "email" })}
              {field("password", "Password", { type: "password" })}
              {field("idRef", "Aadhaar / ID Reference Number", {
                inputMode: "numeric",
                maxLength: 12,
                placeholder: "12 digits",
              })}
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {field("taluk", "Taluk")}
              {field("village", "Village")}
              {field("surveyNo", "Survey Number")}
              {field("landArea", "Land Area", { placeholder: "e.g. 2.5 acres" })}
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={3}
                />
                {errors["address"] && (
                  <p className="text-xs font-medium text-destructive">
                    {errors["address"]}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Button size="lg" className="w-full" onClick={submit}>
                  Send OTP & Continue
                </Button>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link to="/login" className="font-semibold text-primary underline">
                    Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-elevated mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Mobile Verification
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit OTP sent to {form.mobile}. Demo OTP: 123456
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button size="lg" className="w-full" onClick={verify}>
                Verify & Create Account
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep("form")}
              >
                Edit details
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
