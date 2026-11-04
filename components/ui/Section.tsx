import { cx } from "@/lib/format";

/** Consistent section wrapper: landmark + heading + optional intro. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  align = "center",
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx("relative py-12 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className={cx("mb-8 max-w-2xl sm:mb-14", align === "center" && "mx-auto text-center")} data-reveal>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="text-[2.125rem] text-ink sm:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

/** Renders `text` with `highlight` (if present) wrapped in an italic serif accent. */
export function Highlighted({ text, highlight, ownLine = false }: { text: string; highlight?: string; ownLine?: boolean }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  // `ownLine`: a phrase that ends the headline starts its own line, so the switch to the accent
  // style never lands mid-line.
  const breakBefore = ownLine && /^[\s.!?,]*$/.test(after) && before.trim().length > 0;
  return (
    <>
      {/* The last two words stay together, so a short word like "for" never sits alone on a line. */}
      {breakBefore ? before.trimEnd().replace(/ (\S+)$/, "\u00a0$1") : before}
      {breakBefore && <br />}
      <span className="highlight">{highlight}</span>
      {after}
    </>
  );
}
