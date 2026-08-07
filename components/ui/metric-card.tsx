import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ title, value, detail, icon: Icon, tone = "text-blue-700" }: { title: string; value: string; detail: string; icon: LucideIcon; tone?: string }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-2">
          <Icon className={`h-5 w-5 ${tone}`} />
        </div>
      </CardContent>
    </Card>
  );
}
