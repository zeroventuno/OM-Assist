import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { tickets } from '../shared/schema';

async function importData() {
    const ticketsPath = path.resolve(process.cwd(), 'tickets.json');
    if (!fs.existsSync(ticketsPath)) {
        console.error('tickets.json not found');
        process.exit(1);
    }

    const rawData = fs.readFileSync(ticketsPath, 'utf-8');
    const ticketsData = JSON.parse(rawData);

    console.log(`Found ${ticketsData.length} tickets to import.`);

    for (const ticket of ticketsData) {
        try {
            await db.insert(tickets).values({
                id: ticket.id,
                clientName: ticket.client_name,
                clientEmail: ticket.client_email,
                component: ticket.component,
                brand: ticket.brand,
                serialNumber: ticket.serial_number,
                problem: ticket.problem,
                protocolNumber: ticket.protocol_number,
                approvalStatus: ticket.approval_status,
                phase: ticket.phase,
                shippingDate: ticket.shipping_date ? new Date(ticket.shipping_date) : null,
                trackingNumber: ticket.tracking_number,
                shippingCompany: ticket.shipping_company,
                completionDate: ticket.completion_date ? new Date(ticket.completion_date) : null,
                history: ticket.history,
                createdAt: ticket.created_at ? new Date(ticket.created_at) : new Date(),
            }).onConflictDoNothing();
            console.log(`Imported ticket: ${ticket.id}`);
        } catch (error) {
            console.error(`Error importing ticket ${ticket.id}:`, error);
        }
    }

    console.log('Import completed.');
    process.exit(0);
}

importData().catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
});
