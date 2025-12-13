import { NextRequest, NextResponse } from "next/server";
import { db, DbMessage } from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const body = await request.json();
        const { role, content, blocks, resources } = body;

        if (!role || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newMessage: DbMessage = {
            id: Date.now().toString(),
            role,
            content,
            blocks,
            resources,
            createdAt: new Date().toISOString(),
        };

        const savedMessage = await db.addMessage(chatId, newMessage);
        return NextResponse.json({ message: savedMessage });
    } catch (error) {
        console.error("Error adding message:", error);
        return NextResponse.json(
            { error: "Failed to add message" },
            { status: 500 }
        );
    }
}
