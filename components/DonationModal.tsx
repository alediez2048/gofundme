"use client";

import { useEffect, useRef, useState } from "react";
import { getStore } from "@/lib/store";
import type { User } from "@/lib/data";

const PRESETS = [25, 50, 100, 250] as const;

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundraiserId: string;
  fundraiserTitle: string;
  users: Record<string, User>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onSuccess: (donorUsername: string) => void;
}

export default function DonationModal({
  isOpen,
  onClose,
  fundraiserId,
  fundraiserTitle,
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
        className="absolute inset-0 bg-stone-900/60"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 id="donation-modal-title" className="text-xl font-semibold text-stone-900">
          Donate to {fundraiserTitle}
        </h2>

        <div className="mt-4">
          <p className="text-sm font-medium text-stone-700">Amount</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                  amount === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                ${n}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm text-stone-600">
            Custom amount ($)
            <input
              type="number"
              min="1"
              step="1"
              value={amount === "" ? "" : amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value) || "")
              }
              className="ml-2 mt-1 w-32 rounded border border-stone-300 px-3 py-2 text-stone-900"
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-stone-700">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message of support..."
            rows={2}
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {userList.length > 1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700">
              Donating as
            </label>
            <select
              value={effectiveDonorId}
              onChange={(e) => setDonorId(e.target.value)}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-stone-900"
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
            className="rounded-lg border border-stone-300 px-4 py-2 text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              (typeof amount === "number" ? amount : Number(amount) || 0) <= 0
            }
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
