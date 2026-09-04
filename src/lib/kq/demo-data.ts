import type {
  Appointment,
  Centre,
  Farmer,
  KQState,
  ProcurementRecord,
  ProcurementRequest,
  Product,
  RescheduleRequest,
  AppNotification,
  QueueStatus,
} from "./types";

export const CROPS = [
  "Paddy",
  "Wheat",
  "Maize",
  "Groundnut",
  "Cotton",
  "Sugarcane",
  "Vegetables",
  "Pulses",
  "Other",
];

export const CROP_CATEGORIES = [
  "Cereal",
  "Pulse",
  "Oilseed",
  "Cash Crop",
  "Vegetable",
  "Other",
];

export const GRADES = ["Grade A (FAQ)", "Grade B", "Grade C"];

export const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export const RESCHEDULE_REASONS = [
  "Medical Emergency",
  "Family Emergency",
  "Vehicle/Transportation Problem",
  "Weather Condition",
  "Harvest Delay",
  "Agricultural Work",
  "Personal Reason",
  "Other",
];

export const DISTRICTS = [
  "Thanjavur",
  "Tiruvarur",
  "Erode",
  "Madurai",
  "Villupuram",
];

export function iso(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CENTRES: Centre[] = [
  {
    id: "c1",
    centreId: "DPC-TNJ-001",
    name: "Thanjavur Direct Purchase Centre",
    district: "Thanjavur",
    taluk: "Thanjavur",
    village: "Vallam",
    address: "Near Regulated Market, Vallam, Thanjavur - 613403",
    contact: "04362-240110",
    workingDays: "Mon - Sat",
    openTime: "09:00",
    closeTime: "17:00",
    dailyCapacity: 500,
    supportedCrops: ["Paddy", "Pulses", "Maize"],
    officerName: "Thiru. R. Manikandan",
    lat: 10.787,
    lng: 79.1378,
  },
  {
    id: "c2",
    centreId: "DPC-TVR-002",
    name: "Mannargudi Procurement Centre",
    district: "Tiruvarur",
    taluk: "Mannargudi",
    village: "Peravurani Road",
    address: "Co-operative Godown Campus, Mannargudi - 614001",
    contact: "04367-252118",
    workingDays: "Mon - Sat",
    openTime: "09:00",
    closeTime: "16:00",
    dailyCapacity: 350,
    supportedCrops: ["Paddy", "Groundnut", "Pulses"],
    officerName: "Tmt. S. Kalaiselvi",
    lat: 10.665,
    lng: 79.4506,
  },
  {
    id: "c3",
    centreId: "DPC-ERD-003",
    name: "Erode Regulated Market Centre",
    district: "Erode",
    taluk: "Bhavani",
    village: "Kalingarayanpalayam",
    address: "Bhavani Main Road, Erode - 638455",
    contact: "0424-2260045",
    workingDays: "Mon - Fri",
    openTime: "08:30",
    closeTime: "16:30",
    dailyCapacity: 420,
    supportedCrops: ["Maize", "Cotton", "Vegetables", "Sugarcane"],
    officerName: "Thiru. K. Prabhu",
    lat: 11.4467,
    lng: 77.6828,
  },
  {
    id: "c4",
    centreId: "DPC-MDU-004",
    name: "Usilampatti Procurement Centre",
    district: "Madurai",
    taluk: "Usilampatti",
    village: "Chekkanurani",
    address: "Agri Market Complex, Usilampatti - 625532",
    contact: "0452-2583311",
    workingDays: "Mon - Sat",
    openTime: "09:00",
    closeTime: "17:00",
    dailyCapacity: 300,
    supportedCrops: ["Pulses", "Groundnut", "Maize", "Vegetables"],
    officerName: "Thiru. M. Arivazhagan",
    lat: 9.9667,
    lng: 77.7833,
  },
  {
    id: "c5",
    centreId: "DPC-VPM-005",
    name: "Tindivanam Paddy Centre",
    district: "Villupuram",
    taluk: "Tindivanam",
    village: "Olakkur",
    address: "TNCSC Godown, Tindivanam - 604001",
    contact: "04147-220087",
    workingDays: "Mon - Sat",
    openTime: "09:30",
    closeTime: "17:30",
    dailyCapacity: 450,
    supportedCrops: ["Paddy", "Sugarcane", "Pulses"],
    officerName: "Tmt. P. Revathi",
    lat: 12.2333,
    lng: 79.65,
  },
];

const NAMES = [
  "Murugan S",
  "Lakshmi R",
  "Karthikeyan M",
  "Selvi P",
  "Ramasamy K",
  "Anbarasi V",
  "Palanivel T",
  "Meena D",
  "Sivakumar A",
  "Vijaya L",
  "Ganesan R",
  "Thangam S",
  "Elumalai N",
  "Bhuvaneswari K",
  "Chinnadurai P",
  "Kavitha M",
  "Rajendran V",
  "Saroja T",
  "Mohan Raj S",
  "Amutha G",
];

const VILLAGES = [
  "Vallam",
  "Orathanadu",
  "Papanasam",
  "Needamangalam",
  "Kodavasal",
  "Anthiyur",
  "Sathyamangalam",
  "Chekkanurani",
  "Sedapatti",
  "Olakkur",
];

const TALUKS = [
  "Thanjavur",
  "Orathanadu",
  "Mannargudi",
  "Bhavani",
  "Usilampatti",
  "Tindivanam",
];

export function tokenFor(n: number): string {
  return `PROC-2026-${String(n).padStart(5, "0")}`;
}

export function buildDemoState(): KQState {
  const farmers: Farmer[] = NAMES.map((name, i) => ({
    id: `f${i + 1}`,
    name,
    mobile: `9${(440000000 + i * 137911).toString().slice(0, 9)}`,
    email: "",
    idRefMasked: `XXXX-XXXX-${(1000 + i * 37) % 9000}`,
    district: DISTRICTS[i % DISTRICTS.length]!,
    taluk: TALUKS[i % TALUKS.length]!,
    village: VILLAGES[i % VILLAGES.length]!,
    surveyNo: `${112 + i}/${(i % 5) + 1}B`,
    landArea: `${(1.5 + (i % 6) * 0.75).toFixed(2)} acres`,
    language: "en",
    address: `${VILLAGES[i % VILLAGES.length]} Post, ${DISTRICTS[i % DISTRICTS.length]} District, Tamil Nadu`,
    createdAt: iso(-40 + i),
  }));

  const products: Product[] = farmers.map((f, i) => ({
    id: `p${i + 1}`,
    farmerId: f.id,
    name: CROPS[i % 8]!,
    category: CROP_CATEGORIES[i % CROP_CATEGORIES.length]!,
    variety: ["ADT 45", "CO 51", "Ponni", "TMV 7", "MDU 1"][i % 5]!,
    quantity: 20 + ((i * 13) % 60),
    unit: "Quintal",
    harvestDate: iso(-12 + (i % 8)),
    expectedProcurementDate: iso((i % 10) - 2),
    grade: GRADES[i % GRADES.length]!,
    storage: "Farm godown",
    documentName: "land-record.pdf",
  }));

  const queueFlow: QueueStatus[] = [
    "Completed",
    "Weighing",
    "Quality Check",
    "Document Verification",
    "Called",
    "Waiting",
    "Waiting",
    "Waiting",
  ];

  const appointments: Appointment[] = [];
  const requests: ProcurementRequest[] = [];
  const records: ProcurementRecord[] = [];

  farmers.forEach((f, i) => {
    const product = products[i]!;
    const centre = CENTRES[i % CENTRES.length]!;
    const qty = product.quantity;
    if (i < 8) {
      // today's queue
      appointments.push({
        id: `APPT-${100 + i}`,
        token: tokenFor(120 + i),
        farmerId: f.id,
        productId: product.id,
        centreId: centre.id,
        quantityQtl: qty,
        date: iso(0),
        timeSlot: TIME_SLOTS[i % TIME_SLOTS.length]!,
        status: i === 0 ? "Completed" : "Confirmed",
        queueStatus: queueFlow[i]!,
        arrived: i < 5,
        createdAt: iso(-5),
      });
      if (i === 0) {
        records.push({
          id: `REC-${i}`,
          appointmentId: `APPT-${100 + i}`,
          farmerId: f.id,
          actualQuantityQtl: qty - 1,
          grade: "Grade A (FAQ)",
          weighing: `${(qty - 1) * 100} Kg`,
          date: iso(0),
          remarks: "Moisture within limits.",
        });
      }
    } else if (i < 13) {
      appointments.push({
        id: `APPT-${100 + i}`,
        token: tokenFor(120 + i),
        farmerId: f.id,
        productId: product.id,
        centreId: centre.id,
        quantityQtl: qty,
        date: iso(1 + (i % 4)),
        timeSlot: TIME_SLOTS[i % TIME_SLOTS.length]!,
        status: "Scheduled",
        queueStatus: "Waiting",
        arrived: false,
        createdAt: iso(-3),
      });
    } else if (i < 17) {
      requests.push({
        id: `REQ-${200 + i}`,
        farmerId: f.id,
        productId: product.id,
        centreId: centre.id,
        quantityQtl: qty,
        preferredDate: iso(2 + (i % 5)),
        status: "Pending Officer Review",
        createdAt: iso(-1),
      });
    } else {
      // completed history
      appointments.push({
        id: `APPT-${100 + i}`,
        token: tokenFor(100 + i),
        farmerId: f.id,
        productId: product.id,
        centreId: centre.id,
        quantityQtl: qty,
        date: iso(-7 - (i % 5)),
        timeSlot: TIME_SLOTS[i % TIME_SLOTS.length]!,
        status: "Completed",
        queueStatus: "Completed",
        arrived: true,
        createdAt: iso(-14),
      });
      records.push({
        id: `REC-${i}`,
        appointmentId: `APPT-${100 + i}`,
        farmerId: f.id,
        actualQuantityQtl: qty - 2,
        grade: GRADES[i % GRADES.length]!,
        weighing: `${(qty - 2) * 100} Kg`,
        date: iso(-7 - (i % 5)),
        remarks: "Procurement completed and payment initiated.",
      });
    }
  });

  const reschedules: RescheduleRequest[] = [
    {
      id: "RS-1",
      appointmentId: "APPT-109",
      farmerId: "f10",
      reason: "Weather Condition",
      explanation:
        "I cannot attend the procurement appointment because of heavy rain and transportation issues.",
      proofName: "rain-photo.jpg",
      requestedDate: iso(5),
      status: "Pending",
      createdAt: iso(-1),
    },
    {
      id: "RS-2",
      appointmentId: "APPT-111",
      farmerId: "f12",
      reason: "Medical Emergency",
      explanation: "Family member admitted in hospital at Thanjavur.",
      requestedDate: iso(6),
      status: "Pending",
      createdAt: iso(0),
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: "n1",
      farmerId: "f1",
      role: "farmer",
      title: "Appointment scheduled",
      body: "Your procurement slot is confirmed. Token PROC-2026-00120.",
      createdAt: iso(-2),
      read: false,
    },
    {
      id: "n2",
      role: "officer",
      title: "New reschedule request",
      body: "2 reschedule requests are waiting for your review.",
      createdAt: iso(0),
      read: false,
    },
  ];

  return {
    farmers,
    centres: CENTRES,
    products,
    requests,
    appointments,
    reschedules,
    records,
    notifications,
    auditLogs: [
      { id: "a1", actor: "system", action: "Demo dataset seeded", at: iso(0) },
    ],
    session: null,
    lang: "en",
  };
}
