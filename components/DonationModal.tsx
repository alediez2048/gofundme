"use client";

import { useEffect, useRef, useState } from "react";
import { getStore } from "@/lib/store";
import type { CauseCategory, User } from "@/lib/data";
import { getImpactProjection } from "@/lib/ai/trust-impact";

const PRESETS = [25, 50, 100, 250] as const;

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundraiserId: string;
  fundraiserTitle: string;
  causeCategory?: CauseCategory;
  users: Record<string, User>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onSuccess: (donorUsername: string) => void;
}

export default function DonationModal({
  isOpen,
  onClose,
  fundraiserId,
  fundraiserTitle,
  causeCategory,
  users,
  triggerRef,
  onSuccess,
}: DonationModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [donorId, setDonorId] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const userList = Object.values(users);
  const effectiveDonorId = donorId || userList[0]?.id || "";
  const selectedDonor = users[effectiveDonorId];

  useEffect(() => {
    if (!isOpen) return;
    setAmount("");
    setMessage("");
    if (!donorId && userList[0]) setDonorId(userList[0].id);
    const el = dialogRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, triggerRef, donorId, userList]);

  const handleConfirm = () => {
    const numAmount = typeof amount === "number" ? amount : Number(amount) || 0;
    if (numAmount <= 0 || !effectiveDonorId) return;
    const store = getStore().getState();
    store.addDonation(fundraiserId, numAmount, effectiveDonorId, message || undefined);
    if (selectedDonor) onSuccess(selectedDonor.username);
    onClose();
    triggerRef?.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="donation-modal-title"
      ref={dialogRef}
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div className="relative z-10 w-full max-w-md rounded-xxl bg-white p-5 shadow-strong sm:p-6">
        <h2 id="donation-modal-title" className="text-heading-md text-heading">
          Donate to {fundraiserTitle}
        </h2>

        <div className="mt-5">
          <p className="text-body-sm font-bold text-heading">Amount</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className={`rounded-pill border px-5 py-2.5 text-body-sm font-bold transition-all duration-hrt ease-hrt ${
                  amount === n
                    ? "border-brand-strong bg-brand-strong text-brand-lime"
                    : "border-neutral-border bg-white text-heading hover:bg-surface-subtle"
                }`}
              >
                ${n}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-body-sm text-supporting">
            Custom amount ($)
            <input
              type="number"
              min="1"
              step="1"
              value={amount === "" ? "" : amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value) || "")
              }
              className="mt-1 block w-full rounded-md border border-neutral-border px-3 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading sm:ml-2 sm:inline sm:w-32"
            />
          </label>

          {/* Impact Projection */}
          {causeCategory && typeof amount === "number" && amount > 0 && (() => {
            const impact = getImpactProjection(amount, causeCategory);
            return impact ? (
              <p className="mt-2 rounded-xl bg-brand-mint px-3 py-2 text-body-sm text-positive">
                {impact}
              </p>
            ) : null;
          })()}
        </div>

        <div className="mt-4">
          <label className="block text-body-sm font-bold text-heading">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message of support..."
            rows={2}
            className="mt-1 w-full rounded-md border border-neutral-border px-3 py-2.5 text-heading placeholder:text-neutral-disabled focus:border-heading focus:ring-1 focus:ring-heading"
          />
        </div>

        {userList.length > 1 && (
          <div className="mt-4">
            <label className="block text-body-sm font-bold text-heading">
              Donating as
            </label>
            <select
              value={effectiveDonorId}
              onChange={(e) => setDonorId(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-border px-3 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
            >
              {userList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="hrt-btn-secondary px-5 py-2.5 text-body-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              (typeof amount === "number" ? amount : Number(amount) || 0) <= 0
            }
            className="hrt-btn-primary-md px-5 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
