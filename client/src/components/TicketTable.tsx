import { type Ticket } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TicketTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

export default function TicketTable({ tickets, onEdit, onDelete }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum ticket cadastrado</h3>
        <p className="text-sm text-muted-foreground mb-6">Comece criando seu primeiro ticket de suporte</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">ID</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Cliente</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Email</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Componente</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Marca</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Status</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Data</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide py-3 px-4 text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover-elevate" data-testid={`row-ticket-${ticket.id}`}>
                <td className="py-4 px-4 text-sm font-mono text-muted-foreground" data-testid={`text-id-${ticket.id}`}>
                  #{ticket.id.slice(0, 8)}
                </td>
                <td className="py-4 px-4 text-sm" data-testid={`text-client-name-${ticket.id}`}>{ticket.clientName}</td>
                <td className="py-4 px-4 text-sm text-muted-foreground" data-testid={`text-email-${ticket.id}`}>{ticket.clientEmail}</td>
                <td className="py-4 px-4 text-sm" data-testid={`text-component-${ticket.id}`}>{ticket.component}</td>
                <td className="py-4 px-4 text-sm text-muted-foreground" data-testid={`text-brand-${ticket.id}`}>{ticket.brand}</td>
                <td className="py-4 px-4">
                  <StatusBadge status={ticket.status as any} />
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground" data-testid={`text-date-${ticket.id}`}>
                  {format(new Date(ticket.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(ticket)}
                      data-testid={`button-edit-${ticket.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(ticket.id)}
                      data-testid={`button-delete-${ticket.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 border rounded-lg space-y-3 hover-elevate"
            data-testid={`card-ticket-${ticket.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">#{ticket.id.slice(0, 8)}</span>
                  <StatusBadge status={ticket.status as any} />
                </div>
                <h3 className="font-medium truncate">{ticket.clientName}</h3>
                <p className="text-sm text-muted-foreground truncate">{ticket.clientEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Componente:</span>
                <p className="font-medium">{ticket.component}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Marca:</span>
                <p className="font-medium">{ticket.brand}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {format(new Date(ticket.createdAt), "dd/MM/yyyy", { locale: ptBR })}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(ticket)}
                  data-testid={`button-edit-mobile-${ticket.id}`}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(ticket.id)}
                  data-testid={`button-delete-mobile-${ticket.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Deletar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
