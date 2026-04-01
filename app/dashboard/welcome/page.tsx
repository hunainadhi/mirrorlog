import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.onboarded) redirect("/dashboard");

  return <WelcomeScreen userName={user.name || "there"} />;
}