import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildDemoState, iso, tokenFor } from "./demo-data";
import { LangContext } from "./i18n";
import type {
  Appointment,
  AppNotification,
  Farmer,
  KQState,
  Lang,
  ProcurementRecord,
  ProcurementRequest,
  Product,
  QueueStatus,
  RescheduleRequest,
  Role,
} from "./types";

const STORAGE_KEY = "kisanqueue-state-v1";

interface KQContextValue extends KQState {
  setLang: (lang: Lang) => void;
  login: (role: Role, farmerId?: string, name?: string) => void;
  logout: () => void;
  registerFarmer: (
    data: Omit<Farmer, "id" | "createdAt" | "idRefMasked"> & { idRef: string },
  ) => Farmer;
  updateFarmer: (id: string, patch: Partial<Farmer>) => void;
  addProduct: (data: Omit<Product, "id">) => Product;
  createRequest: (
    data: Omit<ProcurementRequest, "id" | "status" | "createdAt">,
  ) => ProcurementRequest;
  decideRequest: (
    id: string,
    approve: boolean,
    opts?: { date?: string; timeSlot?: string; remarks?: string },
  ) => void;
  createReschedule: (
    data: Omit<RescheduleRequest, "id" | "status" | "createdAt">,
  ) => void;
  decideReschedule: (
    id: string,
    approve: boolean,
    opts?: { date?: string; timeSlot?: string; remarks?: string },
  ) => void;
  setQueueStatus: (appointmentId: string, status: QueueStatus) => void;
  markArrived: (appointmentId: string) => void;
  completeProcurement: (
    appointmentId: string,
    record: Omit<ProcurementRecord, "id" | "appointmentId" | "farmerId">,
  ) => void;
  markRead: (id: string) => void;
  bookedCapacity: (centreId: string, date: string) => number;
  nextAvailableDate: (
    centreId: string,
    date: string,
    quantity: number,
  ) => string | null;
  resetDemo: () => void;
}

const KQContext = createContext<KQContextValue | null>(null);

let counter = 500;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export function KQProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KQState>(() => buildDemoState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as KQState);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const pushNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
      setState((s) => ({
        ...s,
        notifications: [
          {
            ...n,
            id: nextId("N"),
            createdAt: new Date().toISOString().slice(0, 10),
            read: false,
          },
          ...s.notifications,
        ],
      }));
    },
    [],
  );

  const log = useCallback((actor: string, action: string) => {
    setState((s) => ({
      ...s,
      auditLogs: [
        { id: nextId("A"), actor, action, at: new Date().toISOString() },
        ...s.auditLogs,
      ],
    }));
  }, []);

  const bookedCapacity = useCallback(
    (centreId: string, date: string) =>
      state.appointments
        .filter(
          (a) =>
            a.centreId === centreId &&
            a.date === date &&
            a.status !== "Cancelled",
        )
        .reduce((sum, a) => sum + a.quantityQtl, 0),
    [state.appointments],
  );

  const nextAvailableDate = useCallback(
    (centreId: string, date: string, quantity: number) => {
      const centre = state.centres.find((c) => c.id === centreId);
      if (!centre) return null;
      const start = new Date(date + "T00:00:00");
      for (let i = 0; i < 30; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        if (centre.dailyCapacity - bookedCapacity(centreId, key) >= quantity)
          return key;
      }
      return null;
    },
    [state.centres, bookedCapacity],
  );

  const value = useMemo<KQContextValue>(
    () => ({
      ...state,
      setLang: (lang) => setState((s) => ({ ...s, lang })),
      login: (role, farmerId, name) =>
        setState((s) => ({
          ...s,
          session: {
            role,
            farmerId,
            name:
              name ??
              (farmerId
                ? (s.farmers.find((f) => f.id === farmerId)?.name ?? "Farmer")
                : role === "officer"
                  ? "Procurement Officer"
                  : "State Admin"),
          },
        })),
      logout: () => setState((s) => ({ ...s, session: null })),
      registerFarmer: (data) => {
        const farmer: Farmer = {
          ...data,
          id: nextId("f"),
          idRefMasked: `XXXX-XXXX-${data.idRef.slice(-4) || "0000"}`,
          createdAt: iso(0),
        };
        setState((s) => ({
          ...s,
          farmers: [...s.farmers, farmer],
          session: { role: "farmer", farmerId: farmer.id, name: farmer.name },
          notifications: [
            {
              id: nextId("N"),
              farmerId: farmer.id,
              role: "farmer",
              title: "Registration successful",
              body: "Welcome to KISANQUEUE. Add your crops to request a procurement slot.",
              createdAt: iso(0),
              read: false,
            },
            ...s.notifications,
          ],
        }));
        return farmer;
      },
      updateFarmer: (id, patch) =>
        setState((s) => ({
          ...s,
          farmers: s.farmers.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),
      addProduct: (data) => {
        const product: Product = { ...data, id: nextId("p") };
        setState((s) => ({ ...s, products: [...s.products, product] }));
        return product;
      },
      createRequest: (data) => {
        const req: ProcurementRequest = {
          ...data,
          id: nextId("REQ"),
          status: "Pending Officer Review",
          createdAt: iso(0),
        };
        setState((s) => ({
          ...s,
          requests: [req, ...s.requests],
          notifications: [
            {
              id: nextId("N"),
              farmerId: data.farmerId,
              role: "farmer",
              title: "Procurement request received",
              body: "Your request is pending officer review.",
              createdAt: iso(0),
              read: false,
            },
            ...s.notifications,
          ],
        }));
        return req;
      },
      decideRequest: (id, approve, opts) =>
        setState((s) => {
          const req = s.requests.find((r) => r.id === id);
          if (!req) return s;
          const requests = s.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: approve
                    ? ("Approved" as const)
                    : ("Rejected" as const),
                  remarks: opts?.remarks,
                }
              : r,
          );
          if (!approve)
            return {
              ...s,
              requests,
              notifications: [
                {
                  id: nextId("N"),
                  farmerId: req.farmerId,
                  role: "farmer" as const,
                  title: "Procurement request rejected",
                  body: opts?.remarks ?? "Please contact the centre officer.",
                  createdAt: iso(0),
                  read: false,
                },
                ...s.notifications,
              ],
            };
          const appt: Appointment = {
            id: nextId("APPT"),
            token: tokenFor(200 + s.appointments.length),
            farmerId: req.farmerId,
            productId: req.productId,
            centreId: req.centreId,
            quantityQtl: req.quantityQtl,
            date: opts?.date ?? req.preferredDate,
            timeSlot: opts?.timeSlot ?? "09:00 - 10:00",
            status: "Scheduled",
            queueStatus: "Waiting",
            arrived: false,
            createdAt: iso(0),
          };
          return {
            ...s,
            requests,
            appointments: [...s.appointments, appt],
            notifications: [
              {
                id: nextId("N"),
                farmerId: req.farmerId,
                role: "farmer" as const,
                title: "Appointment scheduled",
                body: `Slot confirmed on ${appt.date} at ${appt.timeSlot}. Token ${appt.token}.`,
                createdAt: iso(0),
                read: false,
              },
              ...s.notifications,
            ],
          };
        }),
      createReschedule: (data) =>
        setState((s) => ({
          ...s,
          reschedules: [
            { ...data, id: nextId("RS"), status: "Pending", createdAt: iso(0) },
            ...s.reschedules,
          ],
          appointments: s.appointments.map((a) =>
            a.id === data.appointmentId
              ? { ...a, status: "Reschedule Requested" }
              : a,
          ),
          notifications: [
            {
              id: nextId("N"),
              farmerId: data.farmerId,
              role: "farmer" as const,
              title: "Reschedule request received",
              body: "Waiting for officer approval.",
              createdAt: iso(0),
              read: false,
            },
            ...s.notifications,
          ],
        })),
      decideReschedule: (id, approve, opts) =>
        setState((s) => {
          const rs = s.reschedules.find((r) => r.id === id);
          if (!rs) return s;
          const reschedules = s.reschedules.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: approve
                    ? ("Approved" as const)
                    : ("Rejected" as const),
                  officerRemarks: opts?.remarks,
                }
              : r,
          );
          const appointments = s.appointments.map((a) =>
            a.id === rs.appointmentId
              ? approve
                ? {
                    ...a,
                    date: opts?.date ?? rs.requestedDate,
                    timeSlot: opts?.timeSlot ?? a.timeSlot,
                    token: tokenFor(300 + s.appointments.length),
                    status: "Rescheduled" as const,
                  }
                : { ...a, status: "Confirmed" as const }
              : a,
          );
          return {
            ...s,
            reschedules,
            appointments,
            notifications: [
              {
                id: nextId("N"),
                farmerId: rs.farmerId,
                role: "farmer" as const,
                title: approve ? "Reschedule approved" : "Reschedule rejected",
                body: approve
                  ? `New date ${opts?.date ?? rs.requestedDate}. Please check your new token.`
                  : (opts?.remarks ?? "Please attend the original appointment."),
                createdAt: iso(0),
                read: false,
              },
              ...s.notifications,
            ],
          };
        }),
      setQueueStatus: (appointmentId, status) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) =>
            a.id === appointmentId ? { ...a, queueStatus: status } : a,
          ),
        })),
      markArrived: (appointmentId) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((a) =>
            a.id === appointmentId
              ? { ...a, arrived: true, queueStatus: "Waiting" }
              : a,
          ),
        })),
      completeProcurement: (appointmentId, record) =>
        setState((s) => {
          const appt = s.appointments.find((a) => a.id === appointmentId);
          if (!appt) return s;
          return {
            ...s,
            appointments: s.appointments.map((a) =>
              a.id === appointmentId
                ? { ...a, status: "Completed", queueStatus: "Completed" }
                : a,
            ),
            records: [
              {
                ...record,
                id: nextId("REC"),
                appointmentId,
                farmerId: appt.farmerId,
              },
              ...s.records,
            ],
            notifications: [
              {
                id: nextId("N"),
                farmerId: appt.farmerId,
                role: "farmer" as const,
                title: "Procurement completed",
                body: `${record.actualQuantityQtl} Quintals procured. Receipt available in your history.`,
                createdAt: iso(0),
                read: false,
              },
              ...s.notifications,
            ],
          };
        }),
      markRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      bookedCapacity,
      nextAvailableDate,
      resetDemo: () => setState(buildDemoState()),
    }),
    [state, bookedCapacity, nextAvailableDate],
  );

  // keep referenced helpers used by consumers
  void pushNotification;
  void log;

  return (
    <KQContext.Provider value={value}>
      <LangContext.Provider value={state.lang}>{children}</LangContext.Provider>
    </KQContext.Provider>
  );
}

export function useKQ() {
  const ctx = useContext(KQContext);
  if (!ctx) throw new Error("useKQ must be used inside KQProvider");
  return ctx;
}
