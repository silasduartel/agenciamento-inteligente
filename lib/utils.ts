import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function maskPhone(phone: string) {
  return phone.replace(/(\(\d{2}\)\s)\d{5}-(\d{2})\d{2}/, "$1*****-$2**");
}
