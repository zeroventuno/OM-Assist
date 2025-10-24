import { type Ticket, type InsertTicket } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private tickets: Map<string, Ticket>;

  constructor() {
    this.tickets = new Map();
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = {
      id,
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
      createdAt: new Date(),
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, updateData: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const updatedTicket: Ticket = {
      ...ticket,
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
    };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async deleteTicket(id: string): Promise<boolean> {
    return this.tickets.delete(id);
  }
}

export const storage = new MemStorage();
