import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "Entrada" | "Cadastro" | "Em processamento" | "Aprovado" | "Negado" | "Finalizado";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = () => {
    switch (status) {
      case "Entrada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Cadastro":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Em processamento":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse";
      case "Aprovado":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Negado":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800";
      case "Finalizado":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge className={cn("border", getStatusStyle())} data-testid={`badge-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
      {status}
    </Badge>
  );
}
