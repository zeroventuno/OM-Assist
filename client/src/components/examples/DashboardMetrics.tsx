import DashboardMetrics from '../DashboardMetrics';

const mockTickets = [
  { id: "1", status: "Entrada" },
  { id: "2", status: "Em processamento" },
  { id: "3", status: "Em processamento" },
  { id: "4", status: "Aprovado" },
  { id: "5", status: "Finalizado" },
];

export default function DashboardMetricsExample() {
  return (
    <div className="p-6">
      <DashboardMetrics tickets={mockTickets as any} />
    </div>
  );
}
