import { type Ticket } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricsProps {
  tickets: Ticket[];
}

export default function DashboardMetrics({ tickets }: DashboardMetricsProps) {
  const phaseCounts = {
    entrada: tickets.filter((t) => t.phase === "Ingresso").length,
    enviado: tickets.filter((t) => t.phase === "Spedito").length,
    processamento: tickets.filter((t) => t.phase === "In lavorazione").length,
    finalizado: tickets.filter((t) => t.phase === "Completato").length,
  };

  const approvalCounts = {
    aprovado: tickets.filter((t) => t.approvalStatus === "Approvato").length,
    negado: tickets.filter((t) => t.approvalStatus === "Rifiutato").length,
  };

  const metrics = [
    { title: "Totale", value: tickets.length, color: "text-primary" },
    { title: "In Lavorazione", value: phaseCounts.processamento, color: "text-amber-600 dark:text-amber-400" },
    { title: "Approvati", value: approvalCounts.aprovado, color: "text-green-600 dark:text-green-400" },
    { title: "Completati", value: phaseCounts.finalizado, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} data-testid={`card-metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metric.color}`} data-testid={`text-count-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
