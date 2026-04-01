import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import HabitReport from "@/components/report/HabitReport";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function HabitReportPage({ params }: Props) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const habit = await db.habit.findFirst({
        where: { id, userId: user.id },
    });

    if (!habit) return notFound();

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "0 16px" }}>
            <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "48px" }}>

                <a href="/dashboard" style={{ color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
                    Back to dashboard
                </a>
                <HabitReport habitId={id} habitTitle={habit.title} userId={user.id} />
            </div>
        </div>
    );
}