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
      approvalStatus: "",
      phase: "Entrada",
      shippingDate: "",
      trackingNumber: "",
      shippingCompany: "",
      completionDate: "",
    },
  });

  const watchPhase = form.watch("phase");

  useEffect(() => {
    if (watchPhase !== "Enviado") {
      form.setValue("shippingDate", "");
      form.setValue("trackingNumber", "");
      form.setValue("shippingCompany", "");
    }
    if (watchPhase !== "Finalizado") {
      form.setValue("completionDate", "");
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
                <FormLabel>Nome do Cliente *</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} data-testid="input-client-name" />
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
                <FormLabel>Email do Cliente *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="joao@email.com" {...field} data-testid="input-client-email" />
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
                  <Input placeholder="Freio Hidráulico" {...field} data-testid="input-component" />
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
                <FormLabel>Número de Série</FormLabel>
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
                <FormLabel>N° Protocolo</FormLabel>
                <FormControl>
                  <Input placeholder="Fornecido pela fabricante" {...field} value={field.value || ""} data-testid="input-protocol-number" />
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
              <FormLabel>Qual o Problema</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o problema em detalhes..."
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
            name="approvalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status de Aprovação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-approval-status">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Não definido</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Negado">Negado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fase *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-phase">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Em processamento">Em processamento</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchPhase === "Enviado" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium text-sm">Informações de Envio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="shippingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Envio</FormLabel>
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
                      <Input placeholder="BR123456789" {...field} value={field.value || ""} data-testid="input-tracking-number" />
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
                    <FormLabel>Empresa de Envio</FormLabel>
                    <FormControl>
                      <Input placeholder="Correios" {...field} value={field.value || ""} data-testid="input-shipping-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {watchPhase === "Finalizado" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium text-sm">Informações de Finalização</h3>
            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Finalização</FormLabel>
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
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading} data-testid="button-submit">
            {isLoading ? "Salvando..." : defaultValues ? "Atualizar" : "Criar Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
