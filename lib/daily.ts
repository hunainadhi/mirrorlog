const DAILY_API_KEY = process.env.DAILY_API_KEY!;
const DAILY_API_URL = "https://api.daily.co/v1";

export async function createDailyRoom(roomName: string, expiryMinutes: number = 60) {
    const exp = Math.round(Date.now() / 1000) + expiryMinutes * 60;

    const res = await fetch(`${DAILY_API_URL}/rooms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
            name: roomName,
            privacy: "private",
            properties: {
                exp,
                max_participants: 5,
                enable_chat: false,
                enable_screenshare: false,
                start_audio_off: true,
                // Room-level audio disable
                owner_only_broadcast: false,
                audio_only: false,
            },
        }),
    });

    return await res.json();
}

export async function createDailyToken(roomName: string, userName: string) {
    const exp = Math.round(Date.now() / 1000) + 60 * 60;

    const res = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
            properties: {
                room_name: roomName,
                user_name: userName,
                exp,

                // Start muted just in case
                start_audio_off: true,

                // Critical: allow video only
                permissions: {
                    canSend: ["video"],
                },
            },
        }),
    });

    const data = await res.json();
    return data.token;
}

export async function deleteDailyRoom(roomName: string) {
    await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${DAILY_API_KEY}` },

    });
}