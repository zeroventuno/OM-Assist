import TicketTable from '../TicketTable';

const mockTickets = [
  {
    id: "abc123def456",
    clientName: "João Silva",
    clientEmail: "joao@email.com",
    component: "Freio Hidráulico",
    brand: "Shimano",
    serialNumber: "SH-2024-001",
    problem: "Freio não está funcionando corretamente",
    protocolNumber: "PROT-001",
    approvalStatus: "Aprovado",
    phase: "Em processamento",
    shippingDate: null,
    trackingNumber: null,
    shippingCompany: null,
    completionDate: null,
    createdAt: new Date("2024-10-20"),
  },
  {
    id: "def456ghi789",
    clientName: "Maria Santos",
    clientEmail: "maria@email.com",
    component: "Suspensão Dianteira",
    brand: "RockShox",
    serialNumber: "RS-2024-002",
    problem: "Vazamento de óleo",
    protocolNumber: "PROT-002",
    approvalStatus: null,
    phase: "Enviado",
    shippingDate: new Date("2024-10-22"),
    trackingNumber: "BR123456789",
    shippingCompany: "Correios",
    completionDate: null,
    createdAt: new Date("2024-10-22"),
  },
];

export default function TicketTableExample() {
  return (
    <div className="p-6">
      <TicketTable
        tickets={mockTickets as any}
        onEdit={(ticket) => console.log('Edit:', ticket)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  );
}
