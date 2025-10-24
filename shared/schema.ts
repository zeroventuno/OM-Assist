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
  serialNumber: text("serial_number").notNull(),
  status: text("status").notNull(),
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
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  status: z.enum(["Entrada", "Cadastro", "Em processamento", "Aprovado", "Negado", "Finalizado"]),
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
