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
    <section id={id} aria-labelledby={`${id}-title`} className={cx("relative py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className={cx("mb-10 max-w-2xl sm:mb-14", align === "center" && "mx-auto text-center")} data-reveal>
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
export function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className="highlight">{highlight}</span>
      {after}
    </>
  );
}
