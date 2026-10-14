"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Accessible modal built on the native <dialog> element: focus is trapped,
 * Escape closes it, the page behind is inert, and focus returns to the
 * triggering element on close.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handleClose = () => {
      onClose();
      returnFocus.current?.focus?.();
    };
    d.addEventListener("close", handleClose);
    return () => d.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={wide ? "modal modal-wide" : "modal"}
      aria-labelledby={labelledBy}
      // Click on the backdrop (the dialog element itself, outside the panel) closes.
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {open && (
        <div className="modal-panel glass-strong max-h-[inherit] overflow-y-auto overscroll-contain rounded-[28px] max-sm:rounded-b-none">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full text-ink/80 hover:bg-white/80"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
