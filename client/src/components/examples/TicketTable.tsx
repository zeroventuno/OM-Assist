import TicketTable from '../TicketTable';

const mockTickets = [
  {
    id: "abc123def456",
    clientName: "João Silva",
    clientEmail: "joao@email.com",
    component: "Freio Hidráulico",
    brand: "Shimano",
    serialNumber: "SH-2024-001",
    status: "Em processamento",
    createdAt: new Date("2024-10-20"),
  },
  {
    id: "def456ghi789",
    clientName: "Maria Santos",
    clientEmail: "maria@email.com",
    component: "Suspensão Dianteira",
    brand: "RockShox",
    serialNumber: "RS-2024-002",
    status: "Aprovado",
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
