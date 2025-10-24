import Header from '../Header';

export default function HeaderExample() {
  return <Header onNewTicket={() => console.log('New ticket clicked')} />;
}
