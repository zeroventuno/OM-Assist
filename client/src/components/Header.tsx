import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import logoUrl from "@assets/om-logotipo (2)_1761313398826.png";

interface HeaderProps {
  onNewTicket: () => void;
}

export default function Header({ onNewTicket }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="OM Assistenza" className="h-8" />
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, var(--font-sans)' }}>
            OM Assistenza
          </h1>
        </div>
        
        <Button onClick={onNewTicket} data-testid="button-new-ticket">
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Ticket
        </Button>
      </div>
    </header>
  );
}
