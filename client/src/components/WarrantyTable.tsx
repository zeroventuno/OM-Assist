import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { type Warranty } from "@shared/schema";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface WarrantyTableProps {
    warranties: Warranty[];
    onEdit: (warranty: Warranty) => void;
    onDelete: (id: string) => void;
}

export default function WarrantyTable({ warranties, onEdit, onDelete }: WarrantyTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "In attesa":
                return <Badge variant="outline">{status}</Badge>;
            case "In lavorazione":
                return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">{status}</Badge>;
            case "Completato":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{status}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[120px]">Protocollo</TableHead>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>Modello</TableHead>
                    <TableHead>Serial #</TableHead>
                    <TableHead>Soluzione</TableHead>
                    <TableHead>Produttore</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {warranties.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                            Nessuna garanzia trovata.
                        </TableCell>
                    </TableRow>
                ) : (
                    warranties.map((warranty) => (
                        <TableRow key={warranty.id}>
                            <TableCell className="font-mono text-xs font-bold">{warranty.protocolNumber}</TableCell>
                            <TableCell className="text-xs">
                                {formatDate(new Date(warranty.startDate), "dd/MM/yy")}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{warranty.customerName}</span>
                                    <span className="text-xs text-muted-foreground">{warranty.email}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{warranty.agent}</TableCell>
                            <TableCell className="text-sm">
                                <div className="flex flex-col">
                                    <span>{warranty.bikeModel}</span>
                                    <span className="text-xs text-muted-foreground">Taglia: {warranty.size}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs font-mono">{warranty.serialNumber}</TableCell>
                            <TableCell className="text-sm">{warranty.solution || "-"}</TableCell>
                            <TableCell className="text-sm">{warranty.producer || "-"}</TableCell>
                            <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(warranty)}
                                        className="h-8 w-8"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(warranty.id)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
