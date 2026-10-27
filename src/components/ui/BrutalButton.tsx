import Link from "next/link";
import type { Accent } from "@/lib/types";
import { accentBg, accentText } from "@/lib/theme";

type Common = {
  color?: Accent | "ink" | "paper";
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type Props =
  | (Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "color">)
  | (Common & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">);

const colorClass = (color: Common["color"]) =>
  color === "ink" ? "bg-ink text-paper" : color === "paper" ? "bg-paper text-ink" : `${accentBg[color ?? "yellow"]} ${accentText[color ?? "yellow"]}`;

export function BrutalButton({ color = "yellow", size = "md", className = "", children, ...rest }: Props) {
  const cls = `brutal brutal-press inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap ${
    size === "lg" ? "h-14 px-7 text-lg" : "h-12 px-5 text-base"
  } ${colorClass(color)} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...anchor}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...anchor}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={cls} {...button}>
      {children}
    </button>
  );
}
