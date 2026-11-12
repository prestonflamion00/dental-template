import type { OfficeConfig } from "@/config/types";

type Key = OfficeConfig["placeholders"][number];

/** What each tag says when hovered or tapped. */
const NOTES: Partial<Record<Key, string>> = {
  hours: "We couldn’t find your hours online, so these are typical hours. We’ll use your real ones.",
  insurances: "These plan names are made up. We’ll list the plans you actually accept.",
  services: "We couldn’t find your services, so these are common ones. We’ll list yours.",
};

/**
 * Small "Sample" label beside demo details we filled in ourselves (see config/build.ts).
 * Hover, focus or tap shows why. Renders nothing when the detail is real.
 */
export function SampleTag({ office, what }: { office: OfficeConfig; what: Key }) {
  const note = NOTES[what];
  // Fictional samples aren't anyone's business, so "we couldn't find yours" would make no sense there.
  if (!note || office.fictional || !office.placeholders.includes(what)) return null;
  return (
    <span className="sample-tag" tabIndex={0}>
      Sample
      <span className="sample-tip" role="tooltip">
        {note}
      </span>
    </span>
  );
}
