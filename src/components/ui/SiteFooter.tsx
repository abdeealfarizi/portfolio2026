import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { BrutalButton } from "./BrutalButton";

export function SiteFooter({ name, email }: { name: string; email: string }) {
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:py-20">
        <p className="font-display text-3xl font-black uppercase leading-tight text-balance sm:text-5xl">
          Ayo bikin desain yang <span className="text-lime">berani</span>.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {email && (
            <BrutalButton
              href={`mailto:${email}`}
              color="lime"
              size="lg"
              className="max-w-full text-sm shadow-[6px_6px_0_0_var(--color-pink)] sm:text-lg"
            >
              <span className="truncate">{email}</span>
              <ArrowUpRight weight="bold" className="size-5 shrink-0" aria-hidden />
            </BrutalButton>
          )}
        </div>
        <p className="text-sm text-paper/70">© {name}</p>
      </div>
    </footer>
  );
}
