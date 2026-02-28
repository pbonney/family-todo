import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FamilySetup from "@/components/FamilySetup";

export default async function SetupPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.familyId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <FamilySetup />
    </div>
  );
}
