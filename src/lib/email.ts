import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendReminderEmail({
  to,
  taskTitle,
  dueDate,
  familyName,
}: {
  to: string;
  taskTitle: string;
  dueDate: string;
  familyName: string;
}) {
  await getResend().emails.send({
    from: "Family Todo <reminders@notifications.familytodo.app>",
    to,
    subject: `Reminder: ${taskTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #d97706; margin-bottom: 8px;">Hey! Quick reminder</h2>
        <p style="color: #44403c; font-size: 18px; margin-bottom: 4px;">
          <strong>${taskTitle}</strong>
        </p>
        <p style="color: #78716c; font-size: 14px; margin-bottom: 24px;">
          Due: ${dueDate} &middot; ${familyName}
        </p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard"
           style="display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
          Open Family Todo
        </a>
      </div>
    `,
  });
}

export async function sendInviteEmail({
  to,
  inviterName,
  familyName,
  inviteCode,
}: {
  to: string;
  inviterName: string;
  familyName: string;
  inviteCode: string;
}) {
  await getResend().emails.send({
    from: "Family Todo <invites@notifications.familytodo.app>",
    to,
    subject: `${inviterName} invited you to join ${familyName} on Family Todo`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #d97706; margin-bottom: 8px;">You're invited!</h2>
        <p style="color: #44403c; font-size: 16px;">
          <strong>${inviterName}</strong> wants you to join
          <strong>${familyName}</strong> on Family Todo.
        </p>
        <p style="color: #78716c; font-size: 14px; margin-bottom: 24px;">
          Keep your family organized and on top of things together.
        </p>
        <a href="${process.env.NEXTAUTH_URL}/invite/${inviteCode}"
           style="display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
          Join ${familyName}
        </a>
        <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
          Or enter this code manually: <strong>${inviteCode}</strong>
        </p>
      </div>
    `,
  });
}
