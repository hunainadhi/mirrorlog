import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { generateUniquePseudonym } from "./pseudonyms";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  // Check if user exists by email
  const userByEmail = await db.user.findUnique({
    where: { email },
  });

  if (userByEmail) {
    return await db.user.update({
      where: { email },
      data: { clerkId: userId },
    });
  }

  const pseudonym = await generateUniquePseudonym(db);

  return await db.user.create({
    data: {
      clerkId: userId,
      email,
      name,
      onboarded: false,
      pseudonym,
    },
  });
}