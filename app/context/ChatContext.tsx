"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChatSession {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    messages: ChatMessage[];
    userId: string;
    projectId: string;
    isPinned: boolean;
    isSaved: boolean;
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    senderId: string;
    content: string;
    createdAt: string;
    isEdited: boolean;
    editedAt: string;
    role: "USER" | "ASSISTANT";
}

interface ChatContextState {
    chatSessions: ChatSession[];
    setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    refreshChats: () => Promise<void>;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
}

const ChatContext = createContext<ChatContextState | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const refreshChats = async () => {
        try {
            const res = await fetch("/api/chats");
            if (res.ok) {
                const data = await res.json();
                // Map API data to Context structure if needed, or ensure they match
                setChatSessions(data.chats.map((chat: any) => ({
                    ...chat,
                    userId: "user", // Default for now
                    isSaved: true
                })));
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    // Initial fetch
    React.useEffect(() => {
        refreshChats();
    }, []);

    return (
        <ChatContext.Provider value={{ chatSessions, setChatSessions, refreshChats, isGenerating, setIsGenerating }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};
