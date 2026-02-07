import { type Ticket, type InsertTicket, type UpdateTicket, type HistoryEntry, type Warranty, type InsertWarranty, type UpdateWarranty } from "../shared/schema.js";
import { tickets, warranties } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAllTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: UpdateTicket): Promise<Ticket | undefined>;
  deleteTicket(id: string): Promise<boolean>;

  // Warranty methods
  getAllWarranties(): Promise<Warranty[]>;
  getWarranty(id: string): Promise<Warranty | undefined>;
  createWarranty(warranty: InsertWarranty): Promise<Warranty>;
  updateWarranty(id: string, warranty: UpdateWarranty): Promise<Warranty | undefined>;
  deleteWarranty(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAllTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const now = new Date();

    const initialHistory: HistoryEntry[] = [{
      field: "Ticket",
      oldValue: null,
      newValue: "Creato",
      date: now.toISOString(),
      action: "created"
    }];

    const [ticket] = await db
      .insert(tickets)
      .values({
        clientName: insertTicket.clientName,
        clientEmail: insertTicket.clientEmail,
        component: insertTicket.component,
        brand: insertTicket.brand,
        serialNumber: insertTicket.serialNumber || null,
        problem: insertTicket.problem || null,
        protocolNumber: insertTicket.protocolNumber || null,
        approvalStatus: insertTicket.approvalStatus || null,
        phase: insertTicket.phase,
        shippingDate: insertTicket.shippingDate ? new Date(insertTicket.shippingDate) : null,
        trackingNumber: insertTicket.trackingNumber || null,
        shippingCompany: insertTicket.shippingCompany || null,
        completionDate: insertTicket.completionDate ? new Date(insertTicket.completionDate) : null,
        history: initialHistory,
      })
      .returning();

    return ticket;
  }

  async updateTicket(id: string, updateData: UpdateTicket): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    if (!ticket) return undefined;

    const now = new Date();
    const newHistory: HistoryEntry[] = [...(ticket.history || [])];

    const fieldLabels: Record<string, string> = {
      clientName: "Nome del Cliente",
      clientEmail: "Email del Cliente",
      component: "Componente",
      brand: "Marca",
      serialNumber: "Numero di Serie",
      problem: "Problema",
      protocolNumber: "N° Protocollo",
      approvalStatus: "Stato di Approvazione",
      phase: "Fase",
      shippingDate: "Data di Spedizione",
      trackingNumber: "Tracking",
      shippingCompany: "Corriere",
      completionDate: "Data di Completamento"
    };

    const formatValue = (value: any): string => {
      if (value === null || value === undefined || value === "") return "-";
      if (value instanceof Date) return value.toISOString();
      return String(value);
    };

    const normalizeDateForComparison = (value: any): string => {
      if (value === null || value === undefined || value === "") return "-";
      if (value instanceof Date) return value.toISOString().split('T')[0];
      if (typeof value === 'string' && value.includes('-')) {
        return value.split('T')[0];
      }
      return String(value);
    };

    const isDateField = (key: string): boolean => {
      return key === 'shippingDate' || key === 'completionDate';
    };

    Object.keys(updateData).forEach((key) => {
      const oldValue = (ticket as any)[key];
      const newValue = (updateData as any)[key];

      let formattedOldValue: string;
      let formattedNewValue: string;

      if (isDateField(key)) {
        formattedOldValue = normalizeDateForComparison(oldValue);
        formattedNewValue = normalizeDateForComparison(newValue);
      } else {
        formattedOldValue = formatValue(oldValue);
        formattedNewValue = formatValue(newValue);
      }

      if (formattedOldValue !== formattedNewValue) {
        newHistory.push({
          field: fieldLabels[key] || key,
          oldValue: formattedOldValue,
          newValue: formattedNewValue,
          date: now.toISOString(),
          action: "updated"
        });
      }
    });

    const [updatedTicket] = await db
      .update(tickets)
      .set({
        clientName: updateData.clientName ?? ticket.clientName,
        clientEmail: updateData.clientEmail ?? ticket.clientEmail,
        component: updateData.component ?? ticket.component,
        brand: updateData.brand ?? ticket.brand,
        serialNumber: updateData.serialNumber !== undefined ? updateData.serialNumber || null : ticket.serialNumber,
        problem: updateData.problem !== undefined ? updateData.problem || null : ticket.problem,
        protocolNumber: updateData.protocolNumber !== undefined ? updateData.protocolNumber || null : ticket.protocolNumber,
        approvalStatus: updateData.approvalStatus !== undefined ? updateData.approvalStatus || null : ticket.approvalStatus,
        phase: updateData.phase ?? ticket.phase,
        shippingDate: updateData.shippingDate !== undefined ? (updateData.shippingDate ? new Date(updateData.shippingDate) : null) : ticket.shippingDate,
        trackingNumber: updateData.trackingNumber !== undefined ? updateData.trackingNumber || null : ticket.trackingNumber,
        shippingCompany: updateData.shippingCompany !== undefined ? updateData.shippingCompany || null : ticket.shippingCompany,
        completionDate: updateData.completionDate !== undefined ? (updateData.completionDate ? new Date(updateData.completionDate) : null) : ticket.completionDate,
        history: newHistory,
      })
      .where(eq(tickets.id, id))
      .returning();

    return updatedTicket;
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await db.delete(tickets).where(eq(tickets.id, id));
    return true;
  }

  // Warranty implementations
  async getAllWarranties(): Promise<Warranty[]> {
    return await db.select().from(warranties).orderBy(desc(warranties.createdAt));
  }

  async getWarranty(id: string): Promise<Warranty | undefined> {
    const [warranty] = await db.select().from(warranties).where(eq(warranties.id, id));
    return warranty || undefined;
  }

  async createWarranty(insertWarranty: InsertWarranty): Promise<Warranty> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    // Simple sequential protocol generation
    const allWarranties = await this.getAllWarranties();
    const count = allWarranties.length + 1;
    const protocolNumber = `OMW-${year}-${count.toString().padStart(3, '0')}`;

    const initialHistory: HistoryEntry[] = [{
      field: "Garanzia",
      oldValue: null,
      newValue: "Creato",
      date: now.toISOString(),
      action: "created"
    }];

    const [warranty] = await db
      .insert(warranties)
      .values({
        ...insertWarranty,
        startDate: insertWarranty.startDate ? new Date(insertWarranty.startDate) : now,
        protocolNumber,
        history: initialHistory,
        status: "In attesa",
      })
      .returning();

    return warranty;
  }

  async updateWarranty(id: string, updateData: UpdateWarranty): Promise<Warranty | undefined> {
    const [warranty] = await db.select().from(warranties).where(eq(warranties.id, id));
    if (!warranty) return undefined;

    const now = new Date();
    const newHistory: HistoryEntry[] = [...(warranty.history || [])];

    const fieldLabels: Record<string, string> = {
      customerName: "Nome del Cliente",
      email: "Email",
      agent: "Agente",
      serialNumber: "N° Serial",
      bikeModel: "Modello Bicicletta",
      size: "Taglia",
      problem: "Problema",
      observation: "Osservazione",
      paintDetails: "Dettagli Verniciatura",
      componentsDescription: "Descrizione Componenti",
      status: "Stato",
      solution: "Soluzione",
      producer: "Produttore",
      newSerialNumber: "Nuovo N° Serial",
      orderNumber: "N° Ordine",
      value: "Valore",
      invoice: "Fattura",
      startDate: "Data Inizio",
    };

    const formatValue = (value: any): string => {
      if (value === null || value === undefined || value === "") return "-";
      if (value instanceof Date) return value.toISOString();
      return String(value);
    };

    const normalizeDateForComparison = (value: any): string => {
      if (value === null || value === undefined || value === "") return "-";
      if (value instanceof Date) return value.toISOString().split('T')[0];
      if (typeof value === 'string' && value.includes('-')) {
        return value.split('T')[0];
      }
      return String(value);
    };

    Object.keys(updateData).forEach((key) => {
      const oldValue = (warranty as any)[key];
      const newValue = (updateData as any)[key];

      let formattedOldValue: string;
      let formattedNewValue: string;

      if (key === 'startDate') {
        formattedOldValue = normalizeDateForComparison(oldValue);
        formattedNewValue = normalizeDateForComparison(newValue);
      } else {
        formattedOldValue = formatValue(oldValue);
        formattedNewValue = formatValue(newValue);
      }

      if (formattedOldValue !== formattedNewValue) {
        newHistory.push({
          field: fieldLabels[key] || key,
          oldValue: formattedOldValue,
          newValue: formattedNewValue,
          date: now.toISOString(),
          action: "updated"
        });
      }
    });

    const [updatedWarranty] = await db
      .update(warranties)
      .set({
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : warranty.startDate,
        history: newHistory,
      })
      .where(eq(warranties.id, id))
      .returning();

    return updatedWarranty;
  }

  async deleteWarranty(id: string): Promise<boolean> {
    await db.delete(warranties).where(eq(warranties.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
