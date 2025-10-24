import { type HistoryEntry } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Plus, Edit } from "lucide-react";

interface TicketHistoryProps {
  history: HistoryEntry[] | null;
}

export default function TicketHistory({ history }: TicketHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        Nenhum histórico disponível
      </div>
    );
  }

  const formatHistoryValue = (value: string): string => {
    if (value === "-") return "Não informado";
    
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime()) && value.includes("T")) {
        return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
      }
    } catch (e) {
      // Not a date
    }
    
    return value;
  };

  return (
    <div className="space-y-3 py-4">
      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
        <Clock className="w-4 h-4" />
        Histórico de Alterações
      </h4>
      
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div
            key={index}
            className="flex gap-3 text-sm border-l-2 border-border pl-3 py-2"
            data-testid={`history-entry-${index}`}
          >
            <div className="flex-shrink-0 pt-0.5">
              {entry.action === "created" ? (
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Edit className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-foreground">{entry.field}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              {entry.action === "created" ? (
                <p className="text-muted-foreground mt-0.5">
                  Ticket criado
                </p>
              ) : (
                <div className="mt-1 space-y-0.5">
                  {entry.oldValue !== "-" && (
                    <div className="text-muted-foreground">
                      <span className="text-xs uppercase tracking-wide">De:</span>{" "}
                      <span className="line-through">{formatHistoryValue(entry.oldValue)}</span>
                    </div>
                  )}
                  <div className="text-foreground">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Para:</span>{" "}
                    <span className="font-medium">{formatHistoryValue(entry.newValue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
