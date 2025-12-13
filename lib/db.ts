import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const ensureDb = () => {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ chats: [] }, null, 2));
    }
};

export interface DbChat {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: DbMessage[];
    isPinned?: boolean;
    projectId?: string;
}

export interface DbMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
    blocks?: any[];
    resources?: any[];
}

export const db = {
    getChats: async (): Promise<DbChat[]> => {
        ensureDb();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        return data.chats.sort((a: DbChat, b: DbChat) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    },

    getChat: async (id: string): Promise<DbChat | null> => {
        ensureDb();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        return data.chats.find((c: DbChat) => c.id === id) || null;
    },

    createChat: async (chat: DbChat): Promise<DbChat> => {
        ensureDb();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        data.chats.push(chat);
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return chat;
    },

    addMessage: async (chatId: string, message: DbMessage): Promise<DbMessage> => {
        ensureDb();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        const chatIndex = data.chats.findIndex((c: DbChat) => c.id === chatId);

        if (chatIndex === -1) {
            throw new Error('Chat not found');
        }

        data.chats[chatIndex].messages.push(message);
        data.chats[chatIndex].updatedAt = new Date().toISOString();

        // Update title if it's the first user message and title is default
        if (message.role === 'user' && data.chats[chatIndex].messages.length === 1) {
            const words = message.content.split(" ").slice(0, 5).join(" ");
            data.chats[chatIndex].title = words.length > 40 ? words.substring(0, 40) + "..." : words;
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return message;
    },

    updateChat: async (chatId: string, updates: Partial<DbChat>): Promise<DbChat> => {
        ensureDb();
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        const chatIndex = data.chats.findIndex((c: DbChat) => c.id === chatId);

        if (chatIndex === -1) {
            throw new Error('Chat not found');
        }

        data.chats[chatIndex] = { ...data.chats[chatIndex], ...updates };
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return data.chats[chatIndex];
    }
};
