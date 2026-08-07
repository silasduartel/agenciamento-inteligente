import * as React from "react";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  gray: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({ className, tone = "gray", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1", tones[tone], className)} {...props} />;
}
