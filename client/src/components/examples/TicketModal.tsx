import { useState } from 'react';
import TicketModal from '../TicketModal';
import { Button } from '@/components/ui/button';

export default function TicketModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Abrir Modal</Button>
      <TicketModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          console.log('Submit:', data);
          setOpen(false);
        }}
      />
    </div>
  );
}
