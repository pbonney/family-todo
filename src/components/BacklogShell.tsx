"use client";

import { useState, useMemo } from "react";
import Navbar from "./Navbar";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import InviteModal from "./InviteModal";
import { Search } from "lucide-react";

type FamilyMember = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type TaskAssignee = {
  id: string;
  userId: string;
  user: FamilyMember;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  list: string;
  status: string;
  priority: number;
  position: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: TaskAssignee[];
};

export default function BacklogShell({
  tasks,
  familyMembers,
  inviteCode,
}: {
  tasks: Task[];
  familyMembers: FamilyMember[];
  inviteCode: string;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = tasks;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    if (filterPriority !== null) {
      result = result.filter((t) => t.priority === filterPriority);
    }
    return result;
  }, [tasks, search, filterPriority]);

  return (
    <div className="min-h-screen">
      <Navbar onInviteClick={() => setInviteOpen(true)} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <span>&#128203;</span> Backlog
          </h1>
          <p className="text-stone-500">
            {tasks.length} item{tasks.length === 1 ? "" : "s"} saved for later.
            Promote tasks to your priority list when you&apos;re ready.
          </p>
        </div>

        {/* Search & filter */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
            />
            <input
              type="text"
              placeholder="Search backlog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div className="flex gap-1">
            {[
              { label: "All", value: null },
              { label: "Urgent", value: 1 },
              { label: "High", value: 2 },
              { label: "Medium", value: 3 },
              { label: "Low", value: 4 },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setFilterPriority(value)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  filterPriority === value
                    ? "bg-amber-100 text-amber-800"
                    : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white/30 p-8 text-center">
            {tasks.length === 0 ? (
              <>
                <span className="text-4xl block mb-2">&#128221;</span>
                <p className="font-medium text-stone-600 mb-1">
                  Backlog is empty
                </p>
                <p className="text-sm text-stone-400">
                  Jot down things that need doing at some point — no pressure!
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-stone-600 mb-1">
                  No matching tasks
                </p>
                <p className="text-sm text-stone-400">
                  Try a different search or filter.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                familyMembers={familyMembers}
                variant="active"
              />
            ))}
          </div>
        )}

        {/* Add to backlog */}
        <div className="mt-4">
          <AddTaskForm defaultList="backlog" familyMembers={familyMembers} />
        </div>
      </main>

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        inviteCode={inviteCode}
      />
    </div>
  );
}
