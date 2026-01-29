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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ClipboardList, Info, Factory, Wrench } from "lucide-react";

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
                <div className="space-y-8">
                    {/* Sezione Informazioni Generali */}
                    <Card className="border-muted/40 shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-4 py-2 border-b flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Informazioni Generali</h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                Data Inizio *
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} value={field.value as string || ""} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
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
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                Agente *
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome Agente" {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">Cliente *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mario Rossi" {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
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
                                            <FormLabel className="font-medium">Email *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="mario@email.com" {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sezione Dettagli Bicicletta */}
                    <Card className="border-muted/40 shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-4 py-2 border-b flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Dettagli Bicicletta</h3>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="serialNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">N° Serial *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Serial #" {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
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
                                            <FormLabel className="font-medium">Modello *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Es: F12, Dogma..." {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
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
                                            <FormLabel className="font-medium">Taglia *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Es: 54, L" {...field} className="bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="problem"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">Descrizione del Problema *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descrivi dettagliatamente il problema..."
                                                className="min-h-[100px] bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="paintDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">Dati della Verniciatura</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Codice colore, finitura..."
                                                    className="min-h-[80px] bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
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
                                            <FormLabel className="font-medium">Componenti Montati</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Gruppo, ruote, sella..."
                                                    className="min-h-[80px] bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
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
                                        <FormLabel className="font-medium">Osservazioni Aggiuntive</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Note supplementari..."
                                                className="min-h-[60px] bg-background border-muted/20 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Sezione Aggiornamento Processo */}
                    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
                        <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Aggiornamento Processo</h3>
                            </div>
                            <Badge variant="outline" className="bg-background/80 border-primary/30 text-primary">
                                {form.watch("status")}
                            </Badge>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Stato Attuale</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background border-primary/20 focus:ring-primary/30">
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

                                <FormField
                                    control={form.control}
                                    name="solution"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Soluzione Proposta</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background border-muted/20">
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
                                            <FormLabel className="font-semibold flex items-center gap-2">
                                                <Factory className="w-4 h-4 text-muted-foreground" />
                                                Produttore Coinvolto
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background border-muted/20">
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

                                {watchSolution === "Substituição" && (
                                    <FormField
                                        control={form.control}
                                        name="newSerialNumber"
                                        render={({ field }) => (
                                            <FormItem className="animate-in fade-in slide-in-from-left-2 duration-300">
                                                <FormLabel className="font-semibold text-primary">Nuovo Numero di Serie *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nuovo Serial #" {...field} value={field.value || ""} className="bg-background border-primary/30 ring-primary/10 ring-2" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
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
