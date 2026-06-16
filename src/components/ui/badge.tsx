import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "default"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "gray"
  | "purple";

const tones: Record<Tone, string> = {
  default: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-slate-100 text-slate-600",
  purple: "bg-purple-100 text-purple-700",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
