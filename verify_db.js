const { db } = require('./lib/db');

async function testDb() {
    console.log('Testing DB...');
    try {
        // 1. Create Chat
        const chat = await db.createChat({
            id: 'test-chat-' + Date.now(),
            title: 'Test Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            isPinned: false
        });
        console.log('Chat created:', chat.id);

        // 2. Add Message
        const msg = await db.addMessage(chat.id, {
            id: 'msg-' + Date.now(),
            role: 'user',
            content: 'Hello World',
            createdAt: new Date().toISOString()
        });
        console.log('Message added:', msg.content);

        // 3. Get Chat
        const fetchedChat = await db.getChat(chat.id);
        console.log('Fetched Chat Messages:', fetchedChat.messages.length);

        if (fetchedChat.messages.length === 1 && fetchedChat.messages[0].content === 'Hello World') {
            console.log('SUCCESS: Persistence verified.');
        } else {
            console.error('FAILURE: Message not persisted correctly.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testDb();
