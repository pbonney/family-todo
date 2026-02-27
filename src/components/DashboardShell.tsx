"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import PriorityList from "./PriorityList";
import AddTaskForm from "./AddTaskForm";
import InviteModal from "./InviteModal";
import TaskCard from "./TaskCard";
import Link from "next/link";
import { Archive, UserPlus, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  reminders?: { id: string; scheduledAt: string; sent: boolean }[];
};

export default function DashboardShell({
  priorityTasks,
  recentlyDone,
  backlogCount,
  familyMembers,
  inviteCode,
  userName,
}: {
  priorityTasks: Task[];
  recentlyDone: Task[];
  backlogCount: number;
  familyMembers: FamilyMember[];
  inviteCode: string;
  userName: string;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);

  const greeting = getGreeting(userName);

  return (
    <div className="min-h-screen">
      <Navbar onInviteClick={() => setInviteOpen(true)} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">{greeting}</h1>
          <p className="text-stone-500">
            {priorityTasks.length === 0
              ? "All clear! Add some tasks to your priority list."
              : `You have ${priorityTasks.length} task${priorityTasks.length === 1 ? "" : "s"} to focus on.`}
          </p>
        </div>

        {/* Priority list */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-700 mb-3">
            <span>&#11088;</span> Priority List
          </h2>

          <PriorityList tasks={priorityTasks} familyMembers={familyMembers} />

          <div className="mt-3">
            <AddTaskForm
              defaultList="priority"
              familyMembers={familyMembers}
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/backlog"
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-md transition"
          >
            <div className="rounded-xl bg-violet-100 p-2.5">
              <Archive size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-700 text-sm">
                View Backlog
              </p>
              <p className="text-xs text-stone-400">
                {backlogCount} item{backlogCount === 1 ? "" : "s"} saved for
                later
              </p>
            </div>
          </Link>

          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-md transition text-left"
          >
            <div className="rounded-xl bg-teal-100 p-2.5">
              <UserPlus size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-stone-700 text-sm">
                Invite Family
              </p>
              <p className="text-xs text-stone-400">
                {familyMembers.length} member
                {familyMembers.length === 1 ? "" : "s"} so far
              </p>
            </div>
          </button>
        </section>

        {/* Recently done */}
        {recentlyDone.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-3">
              <CheckCircle2 size={14} /> Recently Done
            </h2>
            <div className="space-y-2">
              {recentlyDone.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  familyMembers={familyMembers}
                  variant="done"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        inviteCode={inviteCode}
      />
    </div>
  );
}

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(" ")[0] || "there";
  if (hour < 12) return `Good morning, ${first}!`;
  if (hour < 17) return `Good afternoon, ${first}!`;
  return `Good evening, ${first}!`;
}
