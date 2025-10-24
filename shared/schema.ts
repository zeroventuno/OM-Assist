import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export interface HistoryEntry {
  field: string;
  oldValue: any;
  newValue: any;
  date: string;
  action: "created" | "updated";
}

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  component: text("component").notNull(),
  brand: text("brand").notNull(),
  serialNumber: text("serial_number"),
  problem: text("problem"),
  protocolNumber: text("protocol_number"),
  approvalStatus: text("approval_status"),
  phase: text("phase").notNull(),
  shippingDate: timestamp("shipping_date"),
  trackingNumber: text("tracking_number"),
  shippingCompany: text("shipping_company"),
  completionDate: timestamp("completion_date"),
  history: jsonb("history").$type<HistoryEntry[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const baseTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  history: true,
}).extend({
  clientEmail: z.string().email("Email non valida"),
  clientName: z.string().min(1, "Nome è obbligatorio"),
  component: z.string().min(1, "Componente è obbligatorio"),
  brand: z.string().min(1, "Marca è obbligatoria"),
  serialNumber: z.string().optional(),
  problem: z.string().optional(),
  protocolNumber: z.string().optional(),
  approvalStatus: z.enum(["Approvato", "Rifiutato"]).optional(),
  phase: z.enum(["Ingresso", "Spedito", "In lavorazione", "Completato"]),
  shippingDate: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingCompany: z.string().optional(),
  completionDate: z.string().optional(),
});

export const insertTicketSchema = baseTicketSchema.refine((data) => {
  if (data.phase === "Completato" && !data.approvalStatus) {
    return false;
  }
  return true;
}, {
  message: "Stato di approvazione è obbligatorio per i ticket completati",
  path: ["approvalStatus"],
});

export const updateTicketSchema = baseTicketSchema.partial().refine((data) => {
  if (data.phase === "Completato" && !data.approvalStatus) {
    return false;
  }
  return true;
}, {
  message: "Stato di approvazione è obbligatorio per i ticket completati",
  path: ["approvalStatus"],
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type UpdateTicket = z.infer<typeof updateTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
