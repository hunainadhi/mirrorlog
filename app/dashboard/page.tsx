import { getCurrentUser } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">MirrorLog</h1>
        <UserButton />
      </div>
      <p className="mt-4 text-gray-600">
        Welcome, {user.name || user.email}!
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Plan: {user.plan}
      </p>
    </div>
  );
}