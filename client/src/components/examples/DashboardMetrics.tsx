import DashboardMetrics from '../DashboardMetrics';

const mockTickets = [
  { id: "1", phase: "Entrada", approvalStatus: null },
  { id: "2", phase: "Em processamento", approvalStatus: null },
  { id: "3", phase: "Em processamento", approvalStatus: "Aprovado" },
  { id: "4", phase: "Enviado", approvalStatus: "Aprovado" },
  { id: "5", phase: "Finalizado", approvalStatus: "Aprovado" },
];

export default function DashboardMetricsExample() {
  return (
    <div className="p-6">
      <DashboardMetrics tickets={mockTickets as any} />
    </div>
  );
}
