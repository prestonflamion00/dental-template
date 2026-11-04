"use client";

import { useState } from "react";
import { cx } from "@/lib/format";

/**
 * On phones, folds `children` behind a button (e.g. "Read bio", "See smile gallery") to keep the
 * page short; on larger screens it's always shown and the button never appears.
 */
export function MobileReveal({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className={cx("btn btn-glass sm:hidden", className)}
        >
          {label}
        </button>
      )}
      <div className={cx(!open && "max-sm:hidden")}>{children}</div>
    </>
  );
}
