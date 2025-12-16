// app/api/insights/route.ts
import { getToken } from '@/lib/getToken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse body - it's optional, can be empty
    let body: {
      start_date?: string;
      end_date?: string;
      category?: string;
    } = {};

    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call your FastAPI backend
    // The backend will use current month if no dates provided
    const response = await fetch(`${process.env.BACKEND_URL}/ai-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body), // Send empty object if no filters
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          { error: errorData.detail || 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      throw new Error(errorData.detail || 'Failed to generate insights');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch cached insights
export async function GET(request: NextRequest) {
  try {
   
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // You could implement a GET endpoint on your backend to fetch cached insights
    const response = await fetch(`${process.env.BACKEND_URL}/ai-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}), // Empty body for current month
    });

    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}