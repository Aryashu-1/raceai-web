import { NextRequest, NextResponse } from "next/server";
import { db, DbChat } from "@/lib/db";

export async function GET() {
    try {
        const chats = await db.getChats();
        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, projectId } = body;

        const newChat: DbChat = {
            id: Date.now().toString(),
            title: title || "New Chat",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            projectId,
            isPinned: false
        };

        const createdChat = await db.createChat(newChat);
        return NextResponse.json({ chat: createdChat });
    } catch (error) {
        console.error("Error creating chat:", error);
        return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
    }
}
