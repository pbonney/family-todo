"use client";

import { useRef, useEffect, useState } from "react";
import { inviteMember } from "@/app/actions";
import { X, Copy, Check, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function InviteModal({
  isOpen,
  onClose,
  inviteCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : "";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-md rounded-2xl p-0 backdrop:bg-black/30 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800">
            Invite Family Members
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Invite code */}
        <div className="mb-5">
          <label className="text-sm font-medium text-stone-500 block mb-2">
            Share this invite code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 font-mono text-lg tracking-widest text-amber-800 text-center font-bold">
              {inviteCode}
            </div>
            <button
              onClick={copyCode}
              className="rounded-xl bg-stone-100 p-3 text-stone-500 hover:bg-stone-200 transition"
              title="Copy code"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {inviteUrl && (
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(inviteUrl);
                toast.success("Invite link copied!");
              }}
              className="mt-2 text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Or copy the invite link
            </button>
          )}
        </div>

        {/* Email invite */}
        <div>
          <label className="text-sm font-medium text-stone-500 block mb-2">
            Or send an email invite
          </label>
          <form
            ref={formRef}
            action={async (formData) => {
              try {
                await inviteMember(formData);
                setEmailSent(true);
                toast.success("Invite sent!");
                formRef.current?.reset();
                setTimeout(() => setEmailSent(false), 3000);
              } catch (e: unknown) {
                const msg =
                  e instanceof Error ? e.message : "Failed to send invite";
                toast.error(msg);
              }
            }}
            className="flex gap-2"
          >
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
            >
              <Mail size={15} />
              {emailSent ? "Sent!" : "Invite"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
