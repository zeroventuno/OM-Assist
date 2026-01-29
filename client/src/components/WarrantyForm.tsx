import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWarrantySchema, type InsertWarranty, type Warranty } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface WarrantyFormProps {
    onSubmit: (data: InsertWarranty) => void;
    onCancel?: () => void;
    defaultValues?: Partial<Warranty>;
    isLoading?: boolean;
}

const PRODUCERS = [
    "Barra",
    "Pedemonte",
    "Barra + Pedemonte",
    "Univer",
    "Univer + Barra"
];

const SOLUTIONS = [
    "Pintura",
    "Reparação + Pintura",
    "Substituição"
];

export default function WarrantyForm({ onSubmit, onCancel, defaultValues, isLoading }: WarrantyFormProps) {
    const form = useForm<InsertWarranty>({
        resolver: zodResolver(insertWarrantySchema),
        defaultValues: (defaultValues as any) || {
            startDate: new Date().toISOString().split('T')[0],
            customerName: "",
            email: "",
            agent: "",
            serialNumber: "",
            bikeModel: "",
            size: "",
            problem: "",
            observation: "",
            paintDetails: "",
            componentsDescription: "",
            status: "In attesa",
            solution: "",
            producer: "",
            newSerialNumber: "",
        },
    });

    const watchSolution = form.watch("solution");

    useEffect(() => {
        if (watchSolution !== "Substituição") {
            form.setValue("newSerialNumber", "");
        }
    }, [watchSolution, form]);

    const handleSubmit = (data: InsertWarranty) => {
        // Ensure dates are strings for the API
        const formattedData = {
            ...data,
            startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
        };
        onSubmit(formattedData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Inizio *</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} value={field.value as string || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="agent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agente *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome Agente" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mario Rossi" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="mario@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold text-sm">Dettagli Bicicletta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel># Serial *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Serial #" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bikeModel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modello Bicicletta *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Modello" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Taglia *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Es: 54, L" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="problem"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Problema *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descrivi il problema..."
                                    className="min-h-[80px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="paintDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dati della Pittura</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Codice colore, finitura..."
                                        className="min-h-[80px]"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="componentsDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Componenti Montati</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Gruppo, ruote, sella..."
                                        className="min-h-[80px]"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Osservazione</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Note aggiuntive..."
                                    className="min-h-[60px]"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
                    <h3 className="font-semibold text-sm">Aggiornamento Processo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="solution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Soluzione</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona una soluzione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {SOLUTIONS.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="producer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Produttore Coinvolto</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona un produttore" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRODUCERS.map(p => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {watchSolution === "Substituição" && (
                        <FormField
                            control={form.control}
                            name="newSerialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nuovo Numero di Serie *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nuovo Serial #" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stato</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleziona lo stato" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="In attesa">In attesa</SelectItem>
                                        <SelectItem value="In lavorazione">In lavorazione</SelectItem>
                                        <SelectItem value="Completato">Completato</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                            Annulla
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Salvataggio..." : defaultValues ? "Aggiorna" : "Includi Processo"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
