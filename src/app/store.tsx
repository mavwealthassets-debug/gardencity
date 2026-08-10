import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type {
  Buyer,
  DocumentItem,
  DocumentStatus,
  NotificationItem,
  Plot,
  PlotStatus,
  Referral,
  SupportTicket,
  PaymentInstallment,
  PaymentTransaction,
} from "@/types";
import {
  plots as initialPlots,
  buyers as initialBuyers,
  documents as initialDocuments,
  buyerNotifications,
  adminNotifications,
  tickets as initialTickets,
  referrals as initialReferrals,
  paymentInstallments as initialInstallments,
  paymentTransactions as initialTransactions,
} from "@/data";

interface AppState {
  plots: Plot[];
  buyers: Buyer[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  tickets: SupportTicket[];
  referrals: Referral[];
  installments: PaymentInstallment[];
  transactions: PaymentTransaction[];
}

type Action =
  | { type: "SET_PLOT_STATUS"; plotId: string; status: PlotStatus; buyerId?: string }
  | { type: "UPLOAD_DOCUMENT"; document: DocumentItem }
  | { type: "SET_DOCUMENT_STATUS"; documentId: string; status: DocumentStatus; verifiedBy?: string; rejectionReason?: string }
  | { type: "RECORD_PAYMENT"; installmentId: string; amount: number; mode: PaymentTransaction["mode"] }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ"; userId: string }
  | { type: "CREATE_TICKET"; ticket: SupportTicket }
  | { type: "UPDATE_TICKET"; ticketId: string; patch: Partial<SupportTicket> }
  | { type: "ADD_TICKET_ACTIVITY"; ticketId: string; activity: SupportTicket["activity"][number] }
  | { type: "ADD_REFERRAL"; referral: Referral }
  | { type: "UPDATE_BUYER"; buyerId: string; patch: Partial<Buyer> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PLOT_STATUS":
      return {
        ...state,
        plots: state.plots.map((p) =>
          p.id === action.plotId ? { ...p, status: action.status, buyerId: action.buyerId ?? p.buyerId } : p
        ),
      };
    case "UPLOAD_DOCUMENT":
      return { ...state, documents: [action.document, ...state.documents] };
    case "SET_DOCUMENT_STATUS":
      return {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.documentId
            ? {
                ...d,
                status: action.status,
                verifiedBy: action.verifiedBy ?? d.verifiedBy,
                rejectionReason: action.status === "Rejected" ? action.rejectionReason : undefined,
                history: [
                  ...d.history,
                  { version: d.version, date: new Date().toISOString().slice(0, 10), action: action.status, by: action.verifiedBy ?? "Admin User" },
                ],
              }
            : d
        ),
      };
    case "RECORD_PAYMENT": {
      const installment = state.installments.find((i) => i.id === action.installmentId);
      if (!installment) return state;
      const newPaid = Math.min(installment.amount, installment.paidAmount + action.amount);
      const status = newPaid >= installment.amount ? "Paid" : "Partially Paid";
      const txn: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        buyerId: installment.buyerId,
        plotId: installment.plotId,
        date: new Date().toISOString().slice(0, 10),
        amount: action.amount,
        mode: action.mode,
        status: "Success",
        referenceNo: `TXN${Date.now()}`,
        receiptAvailable: true,
      };
      return {
        ...state,
        installments: state.installments.map((i) =>
          i.id === action.installmentId ? { ...i, paidAmount: newPaid, status, paidOn: new Date().toISOString().slice(0, 10) } : i
        ),
        transactions: [txn, ...state.transactions],
      };
    }
    case "MARK_NOTIFICATION_READ":
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.userId === action.userId ? { ...n, read: true } : n)),
      };
    case "CREATE_TICKET":
      return { ...state, tickets: [action.ticket, ...state.tickets] };
    case "UPDATE_TICKET":
      return { ...state, tickets: state.tickets.map((t) => (t.id === action.ticketId ? { ...t, ...action.patch } : t)) };
    case "ADD_TICKET_ACTIVITY":
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.ticketId ? { ...t, activity: [...t.activity, action.activity] } : t
        ),
      };
    case "ADD_REFERRAL":
      return { ...state, referrals: [action.referral, ...state.referrals] };
    case "UPDATE_BUYER":
      return { ...state, buyers: state.buyers.map((b) => (b.id === action.buyerId ? { ...b, ...action.patch } : b)) };
    default:
      return state;
  }
}

function initState(): AppState {
  return {
    plots: initialPlots,
    buyers: initialBuyers,
    documents: initialDocuments,
    notifications: [...buyerNotifications, ...adminNotifications],
    tickets: initialTickets,
    referrals: initialReferrals,
    installments: initialInstallments,
    transactions: initialTransactions,
  };
}

interface AppDataContextValue extends AppState {
  dispatch: React.Dispatch<Action>;
  holdPlot: (plotId: string) => void;
  bookPlot: (plotId: string) => void;
  uploadDocument: (doc: DocumentItem) => void;
  verifyDocument: (documentId: string, verifiedBy: string) => void;
  rejectDocument: (documentId: string, verifiedBy: string, reason: string) => void;
  recordPayment: (installmentId: string, amount: number, mode: PaymentTransaction["mode"]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  createTicket: (ticket: SupportTicket) => void;
  updateTicket: (ticketId: string, patch: Partial<SupportTicket>) => void;
  addTicketActivity: (ticketId: string, activity: SupportTicket["activity"][number]) => void;
  addReferral: (referral: Referral) => void;
  updateBuyer: (buyerId: string, patch: Partial<Buyer>) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  const holdPlot = useCallback((plotId: string) => dispatch({ type: "SET_PLOT_STATUS", plotId, status: "reserved" }), []);
  const bookPlot = useCallback(
    (plotId: string) => dispatch({ type: "SET_PLOT_STATUS", plotId, status: "booked" }),
    []
  );
  const uploadDocument = useCallback((document: DocumentItem) => dispatch({ type: "UPLOAD_DOCUMENT", document }), []);
  const verifyDocument = useCallback(
    (documentId: string, verifiedBy: string) => dispatch({ type: "SET_DOCUMENT_STATUS", documentId, status: "Verified", verifiedBy }),
    []
  );
  const rejectDocument = useCallback(
    (documentId: string, verifiedBy: string, reason: string) =>
      dispatch({ type: "SET_DOCUMENT_STATUS", documentId, status: "Rejected", verifiedBy, rejectionReason: reason }),
    []
  );
  const recordPayment = useCallback(
    (installmentId: string, amount: number, mode: PaymentTransaction["mode"]) =>
      dispatch({ type: "RECORD_PAYMENT", installmentId, amount, mode }),
    []
  );
  const markNotificationRead = useCallback((id: string) => dispatch({ type: "MARK_NOTIFICATION_READ", id }), []);
  const markAllNotificationsRead = useCallback((userId: string) => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ", userId }), []);
  const createTicket = useCallback((ticket: SupportTicket) => dispatch({ type: "CREATE_TICKET", ticket }), []);
  const updateTicket = useCallback((ticketId: string, patch: Partial<SupportTicket>) => dispatch({ type: "UPDATE_TICKET", ticketId, patch }), []);
  const addTicketActivity = useCallback(
    (ticketId: string, activity: SupportTicket["activity"][number]) => dispatch({ type: "ADD_TICKET_ACTIVITY", ticketId, activity }),
    []
  );
  const addReferral = useCallback((referral: Referral) => dispatch({ type: "ADD_REFERRAL", referral }), []);
  const updateBuyer = useCallback((buyerId: string, patch: Partial<Buyer>) => dispatch({ type: "UPDATE_BUYER", buyerId, patch }), []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      dispatch,
      holdPlot,
      bookPlot,
      uploadDocument,
      verifyDocument,
      rejectDocument,
      recordPayment,
      markNotificationRead,
      markAllNotificationsRead,
      createTicket,
      updateTicket,
      addTicketActivity,
      addReferral,
      updateBuyer,
    }),
    [state, holdPlot, bookPlot, uploadDocument, verifyDocument, rejectDocument, recordPayment, markNotificationRead, markAllNotificationsRead, createTicket, updateTicket, addTicketActivity, addReferral, updateBuyer]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
