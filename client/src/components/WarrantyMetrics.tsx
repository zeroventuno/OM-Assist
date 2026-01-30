import { type Warranty } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WarrantyMetricsProps {
    warranties: Warranty[];
}

export default function WarrantyMetrics({ warranties }: WarrantyMetricsProps) {
    const statusCounts = {
        attesa: warranties.filter((w) => w.status === "In attesa").length,
        processamento: warranties.filter((w) => w.status === "In lavorazione").length,
        finalizado: warranties.filter((w) => w.status === "Completato").length,
    };

    const metrics = [
        { title: "Totale", value: warranties.length, color: "text-primary" },
        { title: "In Attesa", value: statusCounts.attesa, color: "text-amber-600 dark:text-amber-400" },
        { title: "In Lavorazione", value: statusCounts.processamento, color: "text-blue-600 dark:text-blue-400" },
        { title: "Completati", value: statusCounts.finalizado, color: "text-muted-foreground" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <Card key={metric.title} data-testid={`card-metric-warranty-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${metric.color}`} data-testid={`text-count-warranty-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            {metric.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
