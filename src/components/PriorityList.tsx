"use client";

import TaskCard from "./TaskCard";

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

export default function PriorityList({
  tasks,
  familyMembers,
}: {
  tasks: Task[];
  familyMembers: FamilyMember[];
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 p-8 text-center">
        <span className="text-4xl block mb-2">&#9728;&#65039;</span>
        <p className="font-medium text-stone-600 mb-1">All clear!</p>
        <p className="text-sm text-stone-400">
          Add tasks below or promote items from your backlog.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          familyMembers={familyMembers}
          variant="active"
        />
      ))}
    </div>
  );
}
