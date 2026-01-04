import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertTicketSchema, updateTicketSchema } from "../shared/schema.js";

export function registerRoutes(app: Express): Server {
  app.get("/api/tickets", async (_req, res) => {
    const tickets = await storage.getAllTickets();
    res.json(tickets);
  });

  app.get("/api/tickets/:id", async (req, res) => {
    const ticket = await storage.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }
    res.json(ticket);
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/tickets/:id", async (req, res) => {
    try {
      const validatedData = updateTicketSchema.parse(req.body);
      const ticket = await storage.updateTicket(req.params.id, validatedData);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket não encontrado" });
      }
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/tickets/:id", async (req, res) => {
    const success = await storage.deleteTicket(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
