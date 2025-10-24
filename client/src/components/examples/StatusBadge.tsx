import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="Entrada" />
      <StatusBadge status="Cadastro" />
      <StatusBadge status="Em processamento" />
      <StatusBadge status="Aprovado" />
      <StatusBadge status="Negado" />
      <StatusBadge status="Finalizado" />
    </div>
  );
}
