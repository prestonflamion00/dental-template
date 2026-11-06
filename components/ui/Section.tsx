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
export function Highlighted({
  text,
  highlight,
  ownLine = false,
  decorate,
}: {
  text: string;
  highlight?: string;
  ownLine?: boolean;
  /** Drawings on the highlighted words (components/ui/HeroFlourish.tsx). */
  decorate?: React.ReactNode;
}) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  // `ownLine`: a phrase that ends the headline starts its own line, so the switch to the accent
  // style never lands mid-line.
  const breakBefore = ownLine && /^[\s.!?,]*$/.test(after) && before.trim().length > 0;
  return (
    <>
      {breakBefore ? keepLastWordsTogether(before.trimEnd()) : before}
      {breakBefore && <br />}
      {decorate ? (
        <Decorated highlight={highlight} after={after} decorate={decorate} />
      ) : (
        <>
          <span className="highlight">{highlight}</span>
          {after}
        </>
      )}
    </>
  );
}

/**
 * The drawing goes under the whole highlight (up to three words) or its last two words, kept on one
 * line with any punctuation that follows, so it never stretches across a wrapped line.
 */
function Decorated({ highlight, after, decorate }: { highlight: string; after: string; decorate: React.ReactNode }) {
  const words = highlight.split(" ");
  const n = words.length > 3 ? 2 : words.length;
  const tail = words.slice(-n).join("\u00a0");
  const head = words.slice(0, -n).join(" ");
  return (
    <>
      {head && <span className="highlight">{head} </span>}
      <span className="whitespace-nowrap">
        <span className="hf-wrap">
          <span className="highlight">{tail}</span>
          {decorate}
        </span>
        {after}
      </span>
    </>
  );
}

/** The last two words stay together so a short word like "for" never sits alone on a line, but only
 * when at least three words come first; joining a two-word start could be too wide for small phones. */
function keepLastWordsTogether(text: string): string {
  return text.split(" ").length >= 3 ? text.replace(/ (\S+)$/, "\u00a0$1") : text;
}
