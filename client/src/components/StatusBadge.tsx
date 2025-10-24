import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Phase = "Entrada" | "Enviado" | "Em processamento" | "Finalizado";

interface StatusBadgeProps {
  phase: Phase;
}

export default function StatusBadge({ phase }: StatusBadgeProps) {
  if (!phase) return null;
  
  const getPhaseStyle = () => {
    switch (phase) {
      case "Entrada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Enviado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Em processamento":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse";
      case "Finalizado":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Badge className={cn("border", getPhaseStyle())} data-testid={`badge-phase-${phase.toLowerCase().replace(/\s+/g, '-')}`}>
      {phase}
    </Badge>
  );
}
