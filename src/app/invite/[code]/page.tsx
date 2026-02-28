import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InviteAccept from "@/components/InviteAccept";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const family = await prisma.family.findUnique({
    where: { inviteCode: params.code },
  });

  if (!family) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <span className="text-5xl block mb-3">&#128533;</span>
          <h1 className="text-xl font-bold text-stone-700 mb-2">
            Invalid invite link
          </h1>
          <p className="text-stone-500 mb-4">
            This invite code doesn&apos;t exist or has expired.
          </p>
          <a
            href="/"
            className="text-amber-600 font-medium hover:text-amber-700"
          >
            Go home
          </a>
        </div>
      </div>
    );
  }

  const session = await getServerSession(authOptions);

  // Already logged in and has this family
  if (session?.user?.familyId === family.id) {
    redirect("/dashboard");
  }

  // Logged in but no family or different family
  if (session?.user && !session.user.familyId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <InviteAccept familyName={family.name} inviteCode={params.code} />
      </div>
    );
  }

  // Not logged in - show login prompt
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <InviteAccept
        familyName={family.name}
        inviteCode={params.code}
        needsLogin
      />
    </div>
  );
}
