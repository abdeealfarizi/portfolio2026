import { BrutalButton } from "@/components/ui/BrutalButton";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-pink [-webkit-text-stroke:3px_var(--color-ink)]">404</p>
      <h1 className="font-display text-2xl font-black uppercase">Post ini nggak ketemu</h1>
      <BrutalButton href="/" color="lime">
        Balik ke beranda
      </BrutalButton>
    </div>
  );
}
