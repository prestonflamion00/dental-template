import { Phone } from "lucide-react";
import { BookButton } from "@/components/booking/BookButton";
import { telHref } from "@/lib/format";

/** Sticky bottom action bar on phones: Request + Call always one thumb-tap away. */
export function MobileBar({ phone }: { phone: string }) {
  return (
    <div data-mobile-bar className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="glass-strong grid grid-cols-[1fr_1.4fr] gap-2 rounded-[24px] p-2">
        <a href={telHref(phone)} className="btn btn-glass">
          <Phone size={18} aria-hidden="true" className="text-accent" />
          Call
        </a>
        <BookButton>Request visit</BookButton>
      </div>
    </div>
  );
}
