import {
  Baby,
  CalendarDays,
  ClipboardList,
  Coffee,
  Crown,
  Heart,
  Leaf,
  ScanLine,
  ShieldCheck,
  Siren,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  WandSparkles,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/config/types";

type SvgProps = React.SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Tooth = (p: SvgProps) => (
  <Svg {...p}>
    <path d="M7.2 3C4.8 3 3 4.9 3 7.4c0 2.3.9 3.7 1.6 5.2.6 1.4.8 3 1 4.6.3 2 .8 3.8 2 3.8 1.6 0 1.7-3.2 2.4-5 .4-.9 1.2-1.4 2-1.4s1.6.5 2 1.4c.7 1.8.8 5 2.4 5 1.2 0 1.7-1.8 2-3.8.2-1.6.4-3.2 1-4.6.7-1.5 1.6-2.9 1.6-5.2C21 4.9 19.2 3 16.8 3c-1.9 0-2.9 1-4.8 1S9.1 3 7.2 3Z" />
  </Svg>
);

const Aligners = (p: SvgProps) => (
  <Svg {...p}>
    <path d="M3.5 8.5C3.5 15 7.3 20 12 20s8.5-5 8.5-11.5" />
    <path d="M7 8.5c0 4.3 2.2 7.5 5 7.5s5-3.2 5-7.5" />
    <path d="M3.5 8.5 7 8.5M17 8.5h3.5M9 4.5l1 2M15 4.5l-1 2M12 4v2.5" />
  </Svg>
);

const Implant = (p: SvgProps) => (
  <Svg {...p}>
    <path d="M7.5 2.5h9a2 2 0 0 1 2 2v.8A3.7 3.7 0 0 1 14.8 9H9.2a3.7 3.7 0 0 1-3.7-3.7v-.8a2 2 0 0 1 2-2Z" />
    <path d="M9 12h6M9.5 15h5M10 18h4M11 21h2M12 9v12" />
  </Svg>
);

const lucide: Record<string, React.ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  smile: Smile,
  shield: ShieldCheck,
  siren: Siren,
  baby: Baby,
  heart: Heart,
  crown: Crown,
  stethoscope: Stethoscope,
  calendar: CalendarDays,
  clipboard: ClipboardList,
  coffee: Coffee,
  sun: Sun,
  leaf: Leaf,
  star: Star,
  scan: ScanLine,
  wand: WandSparkles,
};

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  if (name === "tooth") return <Tooth size={size} className={className} />;
  if (name === "aligners") return <Aligners size={size} className={className} />;
  if (name === "implant") return <Implant size={size} className={className} />;
  const C = lucide[name] ?? Sparkles;
  return <C size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}

/* ── Social brand marks (simplified, single-colour) ── */

export function SocialIcon({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (name) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4c-2.3 0-3.8 1.4-3.8 3.9v2.6H8v3h2.5V21h3Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6a6.6 6.6 0 0 1-3.8-1.2v5.6c0 3.4-2.4 5.7-5.6 5.7S5.5 17.2 5.5 14.1c0-3.4 2.8-5.8 6.4-5.4v2.7c-1.7-.4-3.6.6-3.6 2.6 0 1.6 1.2 2.7 2.8 2.7s2.8-1.1 2.8-3V3h2.7Z" />
        </svg>
      );
    case "google":
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.4 10.3H12v3.8h5.4c-.5 2.4-2.6 3.8-5.4 3.8a6 6 0 1 1 3.9-10.5l2.8-2.8A9.9 9.9 0 0 0 12 2a10 10 0 1 0 0 20c5 0 9.6-3.6 9.6-10 0-.6-.1-1.2-.2-1.7Z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
  }
}
