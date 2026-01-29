import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertTicketSchema, updateTicketSchema, insertWarrantySchema, updateWarrantySchema } from "../shared/schema.js";

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

  // Warranty Routes
  app.get("/api/warranties", async (_req, res) => {
    const warranties = await storage.getAllWarranties();
    res.json(warranties);
  });

  app.get("/api/warranties/:id", async (req, res) => {
    const warranty = await storage.getWarranty(req.params.id);
    if (!warranty) {
      return res.status(404).json({ message: "Garanzia non trovata" });
    }
    res.json(warranty);
  });

  app.post("/api/warranties", async (req, res) => {
    try {
      const validatedData = insertWarrantySchema.parse(req.body);
      const warranty = await storage.createWarranty(validatedData);
      res.status(201).json(warranty);
    } catch (error: any) {
      console.error("Error creating warranty:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/warranties/:id", async (req, res) => {
    try {
      const validatedData = updateWarrantySchema.parse(req.body);
      const warranty = await storage.updateWarranty(req.params.id, validatedData);
      if (!warranty) {
        return res.status(404).json({ message: "Garanzia non trovata" });
      }
      res.json(warranty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/warranties/:id", async (req, res) => {
    const success = await storage.deleteWarranty(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Garanzia non trovata" });
    }
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
