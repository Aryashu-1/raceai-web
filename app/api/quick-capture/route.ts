import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for captured items
let capturedItems: Array<{
  id: string;
  type: string;
  content: string;
  createdAt: Date;
}> = [];

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');

    // Filter by type if provided
    const items = type
      ? capturedItems.filter(item => item.type === type)
      : capturedItems;

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching captured items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, content } = await request.json();

    const newItem = {
      id: `capture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      createdAt: new Date(),
    };

    // Save to in-memory storage
    capturedItems.push(newItem);

    console.log('Quick capture saved:', { type, content });

    // If it's a TODO, also add to Today's Focus
    if (type === 'todo') {
      // Forward to todays-focus API
      await fetch(`${request.nextUrl.origin}/api/todays-focus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content,
          priority: 'medium',
          estimatedTime: 30,
        }),
      }).catch(err => console.error('Failed to add to Today\'s Focus:', err));
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error saving quick capture:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
