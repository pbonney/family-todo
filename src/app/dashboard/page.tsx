import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!session.user.familyId) redirect("/setup");

  const familyId = session.user.familyId;

  const [priorityTasks, recentlyDone, backlogCount, familyMembers, family] =
    await Promise.all([
      prisma.task.findMany({
        where: { familyId, list: "priority", status: "pending" },
        include: { assignees: { include: { user: true } }, reminders: true },
        orderBy: [{ priority: "asc" }, { position: "asc" }],
      }),
      prisma.task.findMany({
        where: { familyId, status: "done" },
        include: { assignees: { include: { user: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.task.count({
        where: { familyId, list: "backlog", status: "pending" },
      }),
      prisma.user.findMany({
        where: { familyId },
        select: { id: true, name: true, email: true, image: true },
      }),
      prisma.family.findUnique({
        where: { id: familyId },
        select: { inviteCode: true },
      }),
    ]);

  return (
    <DashboardShell
      priorityTasks={JSON.parse(JSON.stringify(priorityTasks))}
      recentlyDone={JSON.parse(JSON.stringify(recentlyDone))}
      backlogCount={backlogCount}
      familyMembers={JSON.parse(JSON.stringify(familyMembers))}
      inviteCode={family?.inviteCode ?? ""}
      userName={session.user.name ?? ""}
    />
  );
}
