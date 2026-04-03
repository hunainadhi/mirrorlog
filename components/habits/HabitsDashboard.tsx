"use client";

import { useState } from "react";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";

interface Habit {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date | string;
}

interface Props {
    initialHabits: Habit[];
}

export default function HabitsDashboard({ initialHabits }: Props) {
    const [habits, setHabits] = useState(initialHabits);

    async function refreshHabits() {
        const res = await fetch("/api/habits");
        const data = await res.json();
        setHabits(data);
    }

    return (
        <div className="flex flex-col gap-10">
            <HabitForm onHabitCreated={refreshHabits} />
            <HabitList habits={habits} onHabitDeleted={refreshHabits} />
        </div>
    );
}