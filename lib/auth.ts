import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  // Check if user exists in our DB
  const existingUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  // If not, create them (first time login)
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const newUser = await db.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
    },
  });

  return newUser;
}