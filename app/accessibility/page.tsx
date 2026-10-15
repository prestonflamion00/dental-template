import type { Metadata } from "next";
import office from "@/config/office";
import { SimplePage } from "@/components/ui/SimplePage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `${office.practice.name} is committed to an accessible website and office.`,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  const { practice, contact } = office;
  return (
    <SimplePage title="Accessibility statement">
      <p>
        {practice.name} wants everyone to be able to use this website and visit our office comfortably. We aim to meet the
        Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.
      </p>
      <h2>What we’ve done</h2>
      <ul>
        <li>Readable text sizes and colour contrast that meet WCAG AA, including on translucent surfaces.</li>
        <li>Full keyboard navigation with visible focus indicators.</li>
        <li>Descriptive labels for forms, buttons and images.</li>
        <li>Respect for reduced-motion and reduced-transparency system settings.</li>
      </ul>
      <h2>In the office</h2>
      <p>{contact.directionsNote ?? "Please let us know about any access needs before your visit."}</p>
      <h2>Feedback</h2>
      <p>
        If anything on this site is hard to use, please call {contact.phone} or email {contact.email}. We’ll help you directly
        and work to fix the issue.
      </p>
    </SimplePage>
  );
}
