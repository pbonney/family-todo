import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verify cron secret in production
  if (process.env.CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const reminders = await prisma.reminder.findMany({
    where: {
      sent: false,
      scheduledAt: { lte: now },
    },
    include: {
      task: {
        include: {
          family: true,
          assignees: { include: { user: true } },
        },
      },
    },
  });

  let sent = 0;
  for (const reminder of reminders) {
    const recipients = reminder.task.assignees
      .map((a) => a.user.email)
      .filter(Boolean) as string[];

    if (recipients.length === 0) continue;

    try {
      for (const email of recipients) {
        await sendReminderEmail({
          to: email,
          taskTitle: reminder.task.title,
          dueDate: reminder.task.dueDate
            ? format(reminder.task.dueDate, "MMM d, yyyy")
            : "No due date",
          familyName: reminder.task.family.name,
        });
      }

      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      });
      sent++;
    } catch {
      // Log and continue with other reminders
    }
  }

  return NextResponse.json({ ok: true, sent });
}
