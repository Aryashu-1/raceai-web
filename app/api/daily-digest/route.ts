import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    // In production: Generate daily digest from user's data
    const digest = {
      date: new Date().toISOString(),
      summary: {
        projectsUpdated: 3,
        papersRead: 5,
        tasksCompleted: 7,
        collaborations: 2,
      },
      highlights: [
        'You completed 70% of your daily goals',
        'New paper recommendation in your field',
        'Upcoming deadline: Grant proposal (3 days)',
      ],
      recommendedActions: [
        'Review the new paper on attention mechanisms',
        'Update your project timeline',
        'Respond to collaboration request',
      ],
    };

    // In production: Send email using email service (SendGrid, Resend, etc.)
    // await sendEmail({
    //   to: email,
    //   subject: `Your Daily Research Digest - ${new Date().toLocaleDateString()}`,
    //   template: 'daily-digest',
    //   data: digest,
    // });

    return NextResponse.json({ success: true, digest });
  } catch (error) {
    console.error('Error generating digest:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return digest preferences
    const preferences = {
      enabled: true,
      time: '08:00', // 8 AM
      timezone: 'America/New_York',
      includeRecommendations: true,
      includeDeadlines: true,
      includeActivity: true,
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}
