export type Role = "farmer" | "officer" | "admin";

export type Lang = "en" | "ta" | "hi";

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  idRefMasked: string;
  district: string;
  taluk: string;
  village: string;
  surveyNo: string;
  landArea: string;
  language: Lang;
  address: string;
  createdAt: string;
}

export interface Centre {
  id: string;
  centreId: string;
  name: string;
  district: string;
  taluk: string;
  village: string;
  address: string;
  contact: string;
  workingDays: string;
  openTime: string;
  closeTime: string;
  dailyCapacity: number; // quintals
  supportedCrops: string[];
  officerName: string;
  lat: number;
  lng: number;
}

export type Unit = "Kg" | "Quintal" | "Ton";

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  variety: string;
  quantity: number;
  unit: Unit;
  harvestDate: string;
  expectedProcurementDate: string;
  grade: string;
  storage: string;
  documentName?: string;
  imageName?: string;
}

export type RequestStatus =
  | "Pending Officer Review"
  | "Approved"
  | "Rejected";

export interface ProcurementRequest {
  id: string;
  farmerId: string;
  productId: string;
  centreId: string;
  quantityQtl: number;
  preferredDate: string;
  status: RequestStatus;
  createdAt: string;
  remarks?: string;
}

export type AppointmentStatus =
  | "Pending"
  | "Approved"
  | "Scheduled"
  | "Confirmed"
  | "Reschedule Requested"
  | "Rescheduled"
  | "Completed"
  | "Cancelled";

export type QueueStatus =
  | "Waiting"
  | "Called"
  | "Document Verification"
  | "Quality Check"
  | "Weighing"
  | "Procurement Processing"
  | "Completed";

export interface Appointment {
  id: string; // APPT-...
  token: string; // PROC-2026-00125
  farmerId: string;
  productId: string;
  centreId: string;
  quantityQtl: number;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  queueStatus: QueueStatus;
  arrived: boolean;
  createdAt: string;
}

export interface RescheduleRequest {
  id: string;
  appointmentId: string;
  farmerId: string;
  reason: string;
  explanation: string;
  proofName?: string;
  requestedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  officerRemarks?: string;
  createdAt: string;
}

export interface ProcurementRecord {
  id: string;
  appointmentId: string;
  farmerId: string;
  actualQuantityQtl: number;
  grade: string;
  weighing: string;
  date: string;
  remarks: string;
}

export interface AppNotification {
  id: string;
  farmerId?: string;
  role: Role | "all";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  at: string;
}

export interface KQState {
  farmers: Farmer[];
  centres: Centre[];
  products: Product[];
  requests: ProcurementRequest[];
  appointments: Appointment[];
  reschedules: RescheduleRequest[];
  records: ProcurementRecord[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  session: { role: Role; farmerId?: string; name: string } | null;
  lang: Lang;
}
