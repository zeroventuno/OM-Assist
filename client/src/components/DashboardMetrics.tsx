import { type Ticket } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricsProps {
  tickets: Ticket[];
}

export default function DashboardMetrics({ tickets }: DashboardMetricsProps) {
  const statusCounts = {
    entrada: tickets.filter((t) => t.status === "Entrada").length,
    cadastro: tickets.filter((t) => t.status === "Cadastro").length,
    processamento: tickets.filter((t) => t.status === "Em processamento").length,
    aprovado: tickets.filter((t) => t.status === "Aprovado").length,
    negado: tickets.filter((t) => t.status === "Negado").length,
    finalizado: tickets.filter((t) => t.status === "Finalizado").length,
  };

  const metrics = [
    { title: "Total", value: tickets.length, color: "text-primary" },
    { title: "Em Processamento", value: statusCounts.processamento, color: "text-amber-600 dark:text-amber-400" },
    { title: "Aprovados", value: statusCounts.aprovado, color: "text-green-600 dark:text-green-400" },
    { title: "Finalizados", value: statusCounts.finalizado, color: "text-muted-foreground" },
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
