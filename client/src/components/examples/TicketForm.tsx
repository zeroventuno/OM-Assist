import TicketForm from '../TicketForm';

export default function TicketFormExample() {
  return (
    <div className="max-w-2xl p-8">
      <TicketForm
        onSubmit={(data) => console.log('Form submitted:', data)}
        onCancel={() => console.log('Form cancelled')}
      />
    </div>
  );
}
