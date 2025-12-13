async function testApi() {
    const baseUrl = 'http://localhost:3000/api/chats';

    try {
        console.log('1. Creating Chat...');
        const createRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'API Test Chat' })
        });

        if (!createRes.ok) throw new Error('Failed to create chat: ' + createRes.statusText);
        const { chat } = await createRes.json();
        console.log('Chat Created:', chat.id);

        console.log('2. Adding Message...');
        const msgRes = await fetch(`${baseUrl}/${chat.id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'user',
                content: 'Hello API',
                blocks: [{ type: 'paragraph', text: 'Hello API' }]
            })
        });

        if (!msgRes.ok) throw new Error('Failed to add message: ' + msgRes.statusText);
        const { message } = await msgRes.json();
        console.log('Message Added:', message.content);

        console.log('3. Verifying Persistence...');
        const getRes = await fetch(baseUrl);
        const { chats } = await getRes.json();
        const foundChat = chats.find(c => c.id === chat.id);

        if (foundChat && foundChat.messages.length > 0) {
            console.log('SUCCESS: Chat and message persisted.');
        } else {
            console.error('FAILURE: Chat or message not found.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testApi();
