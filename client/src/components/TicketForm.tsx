import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTicketSchema, type InsertTicket } from "@shared/schema";
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

interface TicketFormProps {
  onSubmit: (data: InsertTicket) => void;
  onCancel?: () => void;
  defaultValues?: Partial<InsertTicket>;
  isLoading?: boolean;
}

export default function TicketForm({ onSubmit, onCancel, defaultValues, isLoading }: TicketFormProps) {
  const form = useForm<InsertTicket>({
    resolver: zodResolver(insertTicketSchema),
    defaultValues: defaultValues || {
      clientName: "",
      clientEmail: "",
      component: "",
      brand: "",
      serialNumber: "",
      problem: "",
      protocolNumber: "",
      approvalStatus: undefined,
      phase: "Ingresso",
      shippingDate: "",
      trackingNumber: "",
      shippingCompany: "",
      completionDate: "",
    },
  });

  const watchPhase = form.watch("phase");

  useEffect(() => {
    if (watchPhase !== "Spedito") {
      form.setValue("shippingDate", "");
      form.setValue("trackingNumber", "");
      form.setValue("shippingCompany", "");
    }
    if (watchPhase !== "Completato") {
      form.setValue("completionDate", "");
      form.setValue("approvalStatus", undefined);
    }
  }, [watchPhase, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome del Cliente *</FormLabel>
                <FormControl>
                  <Input placeholder="Mario Rossi" {...field} data-testid="input-client-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del Cliente *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="mario@email.com" {...field} data-testid="input-client-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="component"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Componente *</FormLabel>
                <FormControl>
                  <Input placeholder="Freno Idraulico" {...field} data-testid="input-component" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca *</FormLabel>
                <FormControl>
                  <Input placeholder="Shimano" {...field} data-testid="input-brand" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero di Serie</FormLabel>
                <FormControl>
                  <Input placeholder="SH-2024-001234" {...field} value={field.value || ""} data-testid="input-serial-number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="protocolNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° Protocollo</FormLabel>
                <FormControl>
                  <Input placeholder="Fornito dal produttore" {...field} value={field.value || ""} data-testid="input-protocol-number" />
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
              <FormLabel>Qual è il Problema</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrivi il problema in dettaglio..."
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                  data-testid="input-problem"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fase *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-phase">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona la fase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ingresso">Ingresso</SelectItem>
                    <SelectItem value="Spedito">Spedito</SelectItem>
                    <SelectItem value="In lavorazione">In lavorazione</SelectItem>
                    <SelectItem value="Completato">Completato</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchPhase === "Completato" && (
            <FormField
              control={form.control}
              name="approvalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stato di Approvazione *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined} data-testid="select-approval-status">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona lo stato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Approvato">Approvato</SelectItem>
                      <SelectItem value="Rifiutato">Rifiutato</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {watchPhase === "Spedito" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium text-sm">Informazioni di Spedizione</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="shippingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data di Spedizione</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} data-testid="input-shipping-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking</FormLabel>
                    <FormControl>
                      <Input placeholder="IT123456789" {...field} value={field.value || ""} data-testid="input-tracking-number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corriere</FormLabel>
                    <FormControl>
                      <Input placeholder="DHL" {...field} value={field.value || ""} data-testid="input-shipping-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {watchPhase === "Completato" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium text-sm">Informazioni di Completamento</h3>
            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di Completamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} data-testid="input-completion-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading} data-testid="button-cancel">
              Annulla
            </Button>
          )}
          <Button type="submit" disabled={isLoading} data-testid="button-submit">
            {isLoading ? "Salvataggio..." : defaultValues ? "Aggiorna" : "Crea Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
