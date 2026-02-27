import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.familyId) redirect("/dashboard");
  if (session?.user) redirect("/setup");
  return <LandingPage />;
}
