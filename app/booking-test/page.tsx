import type { Metadata } from "next";
import { SimplePage } from "@/components/ui/SimplePage";
import { SchedulerDemo } from "@/components/booking/SchedulerDemo";

export const metadata: Metadata = {
  title: "Booking styles test",
  robots: { index: false, follow: false },
};

/** Cal.com link to show; Cal.com's public demo until we have our own free account. */
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || "rick/get-rick-rolled";

/** Practice-run page (not linked anywhere): compares link, pop-up and embedded scheduler styles. */
export default function BookingTestPage() {
  return (
    <SimplePage title="Booking styles test">
      <p>
        Internal test page, not linked from the site. It shows the three ways an online scheduler can go on a practice
        website, using a free scheduler (Cal.com). Real practices would use their own booking tool, placed the same way.
      </p>
      <SchedulerDemo calLink={CAL_LINK} />
    </SimplePage>
  );
}
