import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Ticket, type InsertTicket, type Warranty, type InsertWarranty } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import DashboardMetrics from "@/components/DashboardMetrics";
import TicketTable from "@/components/TicketTable";
import TicketModal from "@/components/TicketModal";
import WarrantyTable from "@/components/WarrantyTable";
import WarrantyModal from "@/components/WarrantyModal";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [modalOpen, setModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: tickets = [], isLoading: isLoadingTickets } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: warranties = [], isLoading: isLoadingWarranties } = useQuery<Warranty[]>({
    queryKey: ["/api/warranties"],
  });

  // Ticket Mutations
  const createTicketMutation = useMutation({
    mutationFn: async (data: InsertTicket) => {
      return await apiRequest("POST", "/api/tickets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setModalOpen(false);
      toast({ title: "Successo", description: "Ticket creato con successo!" });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertTicket }) => {
      return await apiRequest("PATCH", `/api/tickets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setModalOpen(false);
      setEditingTicket(null);
      toast({ title: "Successo", description: "Ticket aggiornato con successo!" });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({ title: "Successo", description: "Ticket eliminato con successo!" });
    },
  });

  // Warranty Mutations
  const createWarrantyMutation = useMutation({
    mutationFn: async (data: InsertWarranty) => {
      return await apiRequest("POST", "/api/warranties", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      setWarrantyModalOpen(false);
      toast({ title: "Successo", description: "Processo di garanzia incluso!" });
    },
  });

  const updateWarrantyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertWarranty }) => {
      return await apiRequest("PATCH", `/api/warranties/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      setWarrantyModalOpen(false);
      setEditingWarranty(null);
      toast({ title: "Successo", description: "Garanzia aggiornata con successo!" });
    },
  });

  const deleteWarrantyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/warranties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      toast({ title: "Successo", description: "Garanzia eliminata con successo!" });
    },
  });

  const handleTicketSubmit = (data: InsertTicket) => {
    if (editingTicket) {
      updateTicketMutation.mutate({ id: editingTicket.id, data });
    } else {
      createTicketMutation.mutate(data);
    }
  };

  const handleWarrantySubmit = (data: InsertWarranty) => {
    if (editingWarranty) {
      updateWarrantyMutation.mutate({ id: editingWarranty.id, data });
    } else {
      createWarrantyMutation.mutate(data);
    }
  };

  const handleNew = () => {
    if (activeTab === "tickets") {
      setEditingTicket(null);
      setModalOpen(true);
    } else {
      setEditingWarranty(null);
      setWarrantyModalOpen(true);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setModalOpen(true);
  };

  const handleEditWarranty = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    setWarrantyModalOpen(true);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.component.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWarranties = warranties.filter((w) =>
    w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.protocolNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onNewTicket={handleNew} />

      <main className="container max-w-7xl px-4 md:px-8 py-8">
        <DashboardMetrics tickets={tickets} />

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <TabsList>
                <TabsTrigger value="tickets">Ticket Assistenza</TabsTrigger>
                <TabsTrigger value="warranties">Gestione Garanzie</TabsTrigger>
              </TabsList>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <TabsContent value="tickets" className="border rounded-lg overflow-hidden border-none outline-none">
              <div className="border rounded-lg overflow-hidden">
                {isLoadingTickets ? (
                  <div className="flex items-center justify-center py-16 text-muted-foreground">
                    Caricamento ticket...
                  </div>
                ) : (
                  <TicketTable
                    tickets={filteredTickets}
                    onEdit={handleEditTicket}
                    onDelete={(id) => deleteTicketMutation.mutate(id)}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="warranties" className="border rounded-lg overflow-hidden border-none outline-none">
              <div className="border rounded-lg overflow-hidden">
                {isLoadingWarranties ? (
                  <div className="flex items-center justify-center py-16 text-muted-foreground">
                    Caricamento garanzie...
                  </div>
                ) : (
                  <WarrantyTable
                    warranties={filteredWarranties}
                    onEdit={handleEditWarranty}
                    onDelete={(id) => {
                      if (confirm("Sei sicuro di voler eliminare questa garanzia?")) {
                        deleteWarrantyMutation.mutate(id);
                      }
                    }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TicketModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSubmit={handleTicketSubmit}
        isLoading={createTicketMutation.isPending || updateTicketMutation.isPending}
      />

      <WarrantyModal
        open={warrantyModalOpen}
        onClose={() => {
          setWarrantyModalOpen(false);
          setEditingWarranty(null);
        }}
        warranty={editingWarranty}
        onSubmit={handleWarrantySubmit}
        isLoading={createWarrantyMutation.isPending || updateWarrantyMutation.isPending}
      />
    </div>
  );
}
