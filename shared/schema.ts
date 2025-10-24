import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
}).extend({
  clientEmail: z.string().email("Email inválido"),
  clientName: z.string().min(1, "Nome é obrigatório"),
  component: z.string().min(1, "Componente é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  serialNumber: z.string().optional(),
  problem: z.string().optional(),
  protocolNumber: z.string().optional(),
  approvalStatus: z.enum(["Aprovado", "Negado"]).optional(),
  phase: z.enum(["Entrada", "Enviado", "Em processamento", "Finalizado"]),
  shippingDate: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippingCompany: z.string().optional(),
  completionDate: z.string().optional(),
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
