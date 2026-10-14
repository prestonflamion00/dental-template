import type { Metadata } from "next";
import office from "@/config/office";
import { SimplePage } from "@/components/ui/SimplePage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${office.practice.name} handles information shared through this website.`,
  alternates: { canonical: "/privacy" },
};

/** Placeholder policy. Each practice should have this reviewed by their compliance advisor. */
export default function PrivacyPage() {
  const { practice, contact } = office;
  return (
    <SimplePage title="Privacy policy">
      <p>
        {practice.name} respects your privacy. This page explains what information this website collects and how we use it.
        It is a template placeholder and should be reviewed before launch.
      </p>
      <h2>Information you share</h2>
      <p>
        When you request an appointment or send a message, we receive the details you enter, such as your name, phone number
        and email. We use them only to respond to you and schedule care.
      </p>
      <h2>Health information</h2>
      <p>
        Please don’t share detailed medical information through website forms. Your protected health information is handled
        according to our Notice of Privacy Practices, available at the front desk.
      </p>
      <h2>Cookies & analytics</h2>
      <p>This site does not use advertising cookies. Any analytics are aggregate and do not identify you personally.</p>
      <h2>Contact</h2>
      <p>
        Questions? Call {contact.phone} or email {contact.email}.
      </p>
    </SimplePage>
  );
}
