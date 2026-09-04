import type { NavItem } from "./AppShell";

export const farmerNav: NavItem[] = [
  { to: "/farmer/dashboard", label: "Dashboard" },
  { to: "/farmer/products", label: "My Products" },
  { to: "/farmer/appointments", label: "Appointments" },
  { to: "/farmer/history", label: "History" },
];

export const officerNav: NavItem[] = [
  { to: "/officer/dashboard", label: "Dashboard" },
  { to: "/officer/requests", label: "Requests" },
  { to: "/officer/queue", label: "Daily Queue" },
  { to: "/officer/reschedules", label: "Reschedules" },
  { to: "/officer/verify", label: "Verification" },
  { to: "/officer/centres", label: "Centres" },
];

export const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/centres", label: "Centres" },
];
