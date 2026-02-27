import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BacklogShell from "@/components/BacklogShell";

export default async function BacklogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!session.user.familyId) redirect("/setup");

  const familyId = session.user.familyId;

  const [tasks, familyMembers, family] = await Promise.all([
    prisma.task.findMany({
      where: { familyId, list: "backlog", status: "pending" },
      include: { assignees: { include: { user: true } } },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
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
    <BacklogShell
      tasks={JSON.parse(JSON.stringify(tasks))}
      familyMembers={JSON.parse(JSON.stringify(familyMembers))}
      inviteCode={family?.inviteCode ?? ""}
    />
  );
}
