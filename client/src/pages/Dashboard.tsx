import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Ticket, type InsertTicket } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import DashboardMetrics from "@/components/DashboardMetrics";
import TicketTable from "@/components/TicketTable";
import TicketModal from "@/components/TicketModal";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTicket) => {
      return await apiRequest("POST", "/api/tickets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setModalOpen(false);
      toast({
        title: "Successo",
        description: "Ticket creato con successo!",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante la creazione del ticket. Riprova.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertTicket }) => {
      return await apiRequest("PATCH", `/api/tickets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setModalOpen(false);
      setEditingTicket(null);
      toast({
        title: "Successo",
        description: "Ticket aggiornato con successo!",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento del ticket. Riprova.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Successo",
        description: "Ticket eliminato con successo!",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del ticket. Riprova.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertTicket) => {
    if (editingTicket) {
      updateMutation.mutate({ id: editingTicket.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleNewTicket = () => {
    setEditingTicket(null);
    setModalOpen(true);
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo ticket?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.phase.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onNewTicket={handleNewTicket} />

      <main className="container max-w-7xl px-4 md:px-8 py-8">
        <DashboardMetrics tickets={tickets} />

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, var(--font-sans)' }}>
              Ticket di Supporto
            </h2>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cerca ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                Caricamento ticket...
              </div>
            ) : (
              <TicketTable
                tickets={filteredTickets}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      <TicketModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
