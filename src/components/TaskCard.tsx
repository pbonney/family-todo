"use client";

import { useTransition, useState } from "react";
import {
  toggleTaskDone,
  moveTaskToBacklog,
  moveTaskToPriority,
  deleteTask,
  setReminder,
} from "@/app/actions";
import Image from "next/image";
import {
  Circle,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  Trash2,
  Bell,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { format, formatDistanceToNow, isPast, isToday } from "date-fns";

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

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-rose-500",
  2: "bg-orange-400",
  3: "bg-amber-400",
  4: "bg-sky-400",
  5: "bg-stone-300",
};

const PRIORITY_LABELS: Record<number, string> = {
  1: "Urgent",
  2: "High",
  3: "Medium",
  4: "Low",
  5: "Someday",
};

export default function TaskCard({
  task,
  familyMembers,
  variant = "active",
}: {
  task: Task;
  familyMembers: FamilyMember[];
  variant?: "active" | "done";
}) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const isDone = task.status === "done";
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !isDone;

  return (
    <div
      className={`group relative rounded-2xl bg-white border shadow-sm transition ${
        isPending ? "opacity-50" : ""
      } ${
        isDone
          ? "border-emerald-100"
          : isOverdue
            ? "border-rose-200"
            : "border-amber-100 hover:border-amber-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => startTransition(() => toggleTaskDone(task.id))}
          className="mt-0.5 shrink-0"
          aria-label={isDone ? "Mark undone" : "Mark done"}
        >
          {isDone ? (
            <CheckCircle2
              size={22}
              className="text-emerald-500 fill-emerald-50"
            />
          ) : (
            <Circle
              size={22}
              className="text-stone-300 hover:text-amber-400 transition"
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Priority dot */}
            {!isDone && (
              <span
                className={`inline-block h-2 w-2 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[3]}`}
                title={PRIORITY_LABELS[task.priority]}
              />
            )}
            <p
              className={`font-medium text-sm leading-snug ${isDone ? "line-through text-stone-400" : "text-stone-700"}`}
            >
              {task.title}
            </p>
          </div>

          {task.description && (
            <p className="text-xs text-stone-400 line-clamp-1 mb-1">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {/* Due date */}
            {dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs rounded-md px-1.5 py-0.5 ${
                  isOverdue
                    ? "bg-rose-50 text-rose-600"
                    : isToday(dueDate)
                      ? "bg-amber-50 text-amber-700"
                      : "bg-stone-50 text-stone-500"
                }`}
              >
                <Calendar size={11} />
                {isToday(dueDate)
                  ? "Today"
                  : format(dueDate, "MMM d")}
              </span>
            )}

            {/* Assignees */}
            {task.assignees.length > 0 && (
              <div className="flex -space-x-1.5">
                {task.assignees.map(({ user }) => (
                  <div key={user.id} title={user.name ?? user.email ?? ""}>
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-amber-800">
                        {user.name?.[0] ?? "?"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Done timestamp */}
            {isDone && (
              <span className="text-xs text-stone-400">
                {formatDistanceToNow(new Date(task.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {variant === "active" && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu((o) => !o)}
              className="rounded-lg p-1.5 text-stone-300 hover:text-stone-500 hover:bg-stone-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white shadow-lg border border-stone-100 py-1 z-10">
                {task.list === "priority" ? (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      startTransition(() => moveTaskToBacklog(task.id));
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                  >
                    <ArrowDown size={14} />
                    Move to backlog
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      startTransition(() => moveTaskToPriority(task.id));
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                  >
                    <ArrowUp size={14} />
                    Move to priority
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowReminder(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
                >
                  <Bell size={14} />
                  Set reminder
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    startTransition(() => deleteTask(task.id));
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reminder form */}
      {showReminder && (
        <div className="border-t border-stone-100 p-4">
          <form
            action={async (formData) => {
              await setReminder(task.id, formData);
              setShowReminder(false);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <label className="text-xs font-medium text-stone-500 block mb-1">
                Remind at
              </label>
              <input
                name="scheduledAt"
                type="datetime-local"
                required
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>
            <input type="hidden" name="type" value="email" />
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
            >
              Set
            </button>
            <button
              type="button"
              onClick={() => setShowReminder(false)}
              className="rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-50"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
