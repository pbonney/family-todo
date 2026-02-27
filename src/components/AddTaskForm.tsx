"use client";

import { useState, useRef } from "react";
import { createTask } from "@/app/actions";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
} from "lucide-react";
import Image from "next/image";

type FamilyMember = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export default function AddTaskForm({
  defaultList,
  familyMembers,
}: {
  defaultList: "priority" | "backlog";
  familyMembers: FamilyMember[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTask(formData);
        formRef.current?.reset();
        setExpanded(false);
        setSelectedAssignees([]);
      }}
      className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4 transition hover:border-amber-300"
    >
      <input type="hidden" name="list" value={defaultList} />
      {selectedAssignees.map((id) => (
        <input key={id} type="hidden" name="assignees" value={id} />
      ))}

      {/* Title input - always visible */}
      <div className="flex items-center gap-2">
        <Plus size={18} className="text-amber-400 shrink-0" />
        <input
          name="title"
          type="text"
          placeholder={
            defaultList === "priority"
              ? "Add a task to your priority list..."
              : "Add something to the backlog..."
          }
          required
          className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-amber-300 focus:outline-none"
          onFocus={() => !expanded && setExpanded(true)}
        />
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-amber-400 hover:text-amber-600 transition"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded options */}
      {expanded && (
        <div className="mt-3 space-y-3 border-t border-amber-200/50 pt-3">
          {/* Description */}
          <textarea
            name="description"
            placeholder="Add details (optional)"
            rows={2}
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-stone-700 placeholder:text-stone-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
          />

          <div className="flex flex-wrap gap-3">
            {/* Due date */}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-stone-400" />
              <input
                name="dueDate"
                type="date"
                className="rounded-lg border border-stone-200 px-2 py-1.5 text-xs text-stone-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Priority */}
            <select
              name="priority"
              defaultValue="3"
              className="rounded-lg border border-stone-200 px-2 py-1.5 text-xs text-stone-600 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              <option value="1">Urgent</option>
              <option value="2">High</option>
              <option value="3">Medium</option>
              <option value="4">Low</option>
              <option value="5">Someday</option>
            </select>
          </div>

          {/* Assignees */}
          {familyMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={14} className="text-stone-400" />
                <span className="text-xs text-stone-500">Assign to</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {familyMembers.map((member) => {
                  const selected = selectedAssignees.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleAssignee(member.id)}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        selected
                          ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt=""
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="h-4 w-4 rounded-full bg-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-800">
                          {member.name?.[0] ?? "?"}
                        </span>
                      )}
                      {member.name?.split(" ")[0] ?? member.email}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition active:scale-[0.98]"
          >
            Add task
          </button>
        </div>
      )}
    </form>
  );
}
