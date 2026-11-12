import type { OfficeConfig } from "@/config/types";
import { Section } from "@/components/ui/Section";
import { withBase } from "@/lib/format";

/**
 * The practice's own video (`video` in its config): a still frame until it's played, then the
 * player with sound and controls. Nothing downloads until someone presses play.
 */
export function VideoTour({ office }: { office: OfficeConfig }) {
  const v = office.video;
  if (!v) return null;
  return (
    <Section id="video" eyebrow="Take a look inside" title={v.title} intro={v.caption}>
      <div className="glass mx-auto max-w-4xl rounded-[28px] p-2.5" data-reveal>
        <video
          className="block aspect-video w-full rounded-[22px] bg-ink object-cover"
          controls
          playsInline
          preload="none"
          poster={withBase(v.poster)}
          aria-label={`${office.practice.name}: ${v.title}`}
        >
          <source src={withBase(v.src)} type="video/mp4" />
        </video>
      </div>
    </Section>
  );
}
