import { Badge } from "@/components/ui/badge";

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value.includes("Confirm") || value.includes("Reserv") || value.includes("Aprovado") || value.includes("Ativo") || value.includes("Disponível")
      ? "green"
      : value.includes("Crítica") || value.includes("Bloqueado") || value.includes("Cancel") || value.includes("erro") || value.includes("Expirado")
        ? "red"
        : value.includes("Aguard") || value.includes("Pendente") || value.includes("risco") || value.includes("inconsist")
          ? "yellow"
          : value.includes("divulgação") || value.includes("agenciamento") || value.includes("Interessado")
            ? "blue"
            : "gray";

  return <Badge tone={tone}>{value}</Badge>;
}
