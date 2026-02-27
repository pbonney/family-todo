"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Archive,
  LogOut,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({
  onInviteClick,
}: {
  onInviteClick?: () => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session) return null;

  const nav = [
    { href: "/dashboard", label: "Priority", icon: Home },
    { href: "/backlog", label: "Backlog", icon: Archive },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        {/* Left: family name */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">&#127968;</span>
          <span className="font-bold text-amber-700 text-lg">
            {session.user.familyName ?? "Family Todo"}
          </span>
        </Link>

        {/* Center: nav links */}
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-amber-100 text-amber-800"
                    : "text-stone-500 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: user menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-amber-50 transition"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                {session.user.name?.[0] ?? "?"}
              </div>
            )}
            <ChevronDown size={14} className="text-stone-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-white shadow-lg border border-amber-100 py-1 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-2 border-b border-amber-50">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-stone-400 truncate">
                  {session.user.email}
                </p>
              </div>
              {onInviteClick && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onInviteClick();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-amber-50 transition"
                >
                  <UserPlus size={15} />
                  Invite family member
                </button>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-amber-50 transition"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
