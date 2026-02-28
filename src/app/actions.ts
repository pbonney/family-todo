"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/email";

// ── Helpers ───────────────────────────────────────────────

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user;
}

async function requireFamily() {
  const user = await requireUser();
  if (!user.familyId) throw new Error("No family");
  return user as typeof user & { familyId: string };
}

// ── Family actions ────────────────────────────────────────

export async function createFamily(formData: FormData) {
  const user = await requireUser();
  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Family name required");

  const inviteCode = crypto.randomBytes(4).toString("hex");
  const family = await prisma.family.create({
    data: { name, inviteCode },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { familyId: family.id },
  });

  revalidatePath("/");
  redirect("/dashboard");
}

export async function joinFamily(formData: FormData) {
  const user = await requireUser();
  const code = (formData.get("code") as string)?.trim();
  if (!code) throw new Error("Invite code required");

  const family = await prisma.family.findUnique({
    where: { inviteCode: code },
  });
  if (!family) throw new Error("Invalid invite code");

  await prisma.user.update({
    where: { id: user.id },
    data: { familyId: family.id },
  });

  revalidatePath("/");
  redirect("/dashboard");
}

export async function joinFamilyByCode(inviteCode: string) {
  const user = await requireUser();
  const family = await prisma.family.findUnique({
    where: { inviteCode },
  });
  if (!family) throw new Error("Invalid invite code");

  await prisma.user.update({
    where: { id: user.id },
    data: { familyId: family.id },
  });

  revalidatePath("/");
  redirect("/dashboard");
}

export async function inviteMember(formData: FormData) {
  const user = await requireFamily();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) throw new Error("Email required");

  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
  });
  if (!family) throw new Error("Family not found");

  // Check if already a member
  const existing = await prisma.user.findFirst({
    where: { email, familyId: user.familyId },
  });
  if (existing) throw new Error("Already a member");

  await prisma.invitation.create({
    data: {
      email,
      familyId: user.familyId,
      invitedById: user.id,
    },
  });

  // Try to send email (don't fail if Resend isn't configured)
  try {
    await sendInviteEmail({
      to: email,
      inviterName: user.name ?? "Someone",
      familyName: family.name,
      inviteCode: family.inviteCode,
    });
  } catch {
    // Email sending is best-effort
  }

  revalidatePath("/dashboard");
  return { inviteCode: family.inviteCode };
}

// ── Task actions ──────────────────────────────────────────

export async function createTask(formData: FormData) {
  const user = await requireFamily();
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;

  const list = (formData.get("list") as string) || "priority";
  const description = (formData.get("description") as string)?.trim() || null;
  const dueDateStr = formData.get("dueDate") as string;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;
  const priority = parseInt((formData.get("priority") as string) || "3", 10);
  const assigneeIds = formData.getAll("assignees") as string[];

  // Get next position for priority list
  let position = 0;
  if (list === "priority") {
    const lastTask = await prisma.task.findFirst({
      where: { familyId: user.familyId, list: "priority", status: "pending" },
      orderBy: { position: "desc" },
    });
    position = (lastTask?.position ?? -1) + 1;
  }

  await prisma.task.create({
    data: {
      title,
      description,
      list,
      priority,
      position,
      dueDate,
      familyId: user.familyId,
      createdById: user.id,
      assignees:
        assigneeIds.length > 0
          ? { create: assigneeIds.map((uid) => ({ userId: uid })) }
          : undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function toggleTaskDone(taskId: string) {
  const user = await requireFamily();
  const task = await prisma.task.findFirst({
    where: { id: taskId, familyId: user.familyId },
  });
  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: { id: taskId },
    data: { status: task.status === "done" ? "pending" : "done" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function moveTaskToPriority(taskId: string) {
  const user = await requireFamily();

  const lastTask = await prisma.task.findFirst({
    where: { familyId: user.familyId, list: "priority", status: "pending" },
    orderBy: { position: "desc" },
  });
  const position = (lastTask?.position ?? -1) + 1;

  await prisma.task.update({
    where: { id: taskId },
    data: { list: "priority", position },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function moveTaskToBacklog(taskId: string) {
  await requireFamily();
  await prisma.task.update({
    where: { id: taskId },
    data: { list: "backlog", position: 0 },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function updateTask(taskId: string, formData: FormData) {
  const user = await requireFamily();
  const task = await prisma.task.findFirst({
    where: { id: taskId, familyId: user.familyId },
  });
  if (!task) throw new Error("Task not found");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const dueDateStr = formData.get("dueDate") as string;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;
  const priority = parseInt((formData.get("priority") as string) || "3", 10);
  const assigneeIds = formData.getAll("assignees") as string[];

  await prisma.$transaction([
    prisma.taskAssignee.deleteMany({ where: { taskId } }),
    prisma.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        description,
        dueDate,
        priority,
        assignees:
          assigneeIds.length > 0
            ? { create: assigneeIds.map((uid) => ({ userId: uid })) }
            : undefined,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function deleteTask(taskId: string) {
  const user = await requireFamily();
  await prisma.task.deleteMany({
    where: { id: taskId, familyId: user.familyId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}

export async function setReminder(taskId: string, formData: FormData) {
  const user = await requireFamily();
  const task = await prisma.task.findFirst({
    where: { id: taskId, familyId: user.familyId },
  });
  if (!task) throw new Error("Task not found");

  const scheduledAt = new Date(formData.get("scheduledAt") as string);
  const type = (formData.get("type") as string) || "email";

  await prisma.reminder.create({
    data: { taskId, type, scheduledAt },
  });

  revalidatePath("/dashboard");
  revalidatePath("/backlog");
}
