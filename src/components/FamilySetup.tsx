"use client";

import { useState } from "react";
import { createFamily, joinFamily } from "@/app/actions";
import { Home, Users } from "lucide-react";

export default function FamilySetup() {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <span className="text-5xl block mb-3">&#127881;</span>
        <h1 className="text-2xl font-bold text-amber-800 mb-1">
          Welcome to Family Todo!
        </h1>
        <p className="text-stone-500">
          Let&apos;s get you set up with your family.
        </p>
      </div>

      {mode === "choose" && (
        <div className="space-y-3">
          <button
            onClick={() => setMode("create")}
            className="w-full flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-md transition text-left"
          >
            <div className="rounded-xl bg-amber-100 p-3">
              <Home size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-700">
                Start a new family
              </p>
              <p className="text-sm text-stone-400">
                Create a group and invite your family
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("join")}
            className="w-full flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-md transition text-left"
          >
            <div className="rounded-xl bg-teal-100 p-3">
              <Users size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-700">
                Join an existing family
              </p>
              <p className="text-sm text-stone-400">
                Enter the invite code you received
              </p>
            </div>
          </button>
        </div>
      )}

      {mode === "create" && (
        <form
          action={createFamily}
          className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100"
        >
          <h2 className="text-lg font-semibold text-stone-700 mb-4">
            Name your family group
          </h2>
          <input
            name="name"
            type="text"
            placeholder='e.g. "The Johnsons" or "Our House"'
            required
            autoFocus
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="rounded-xl px-4 py-2.5 text-sm text-stone-500 hover:bg-stone-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition active:scale-[0.98]"
            >
              Create family
            </button>
          </div>
        </form>
      )}

      {mode === "join" && (
        <form
          action={joinFamily}
          className="rounded-2xl bg-white p-6 shadow-sm border border-amber-100"
        >
          <h2 className="text-lg font-semibold text-stone-700 mb-4">
            Enter your invite code
          </h2>
          <input
            name="code"
            type="text"
            placeholder="e.g. a1b2c3d4"
            required
            autoFocus
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-700 font-mono tracking-widest text-center placeholder:text-stone-300 placeholder:tracking-normal placeholder:font-sans focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="rounded-xl px-4 py-2.5 text-sm text-stone-500 hover:bg-stone-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition active:scale-[0.98]"
            >
              Join family
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
