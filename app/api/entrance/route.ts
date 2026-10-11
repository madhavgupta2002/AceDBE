import { NextResponse } from 'next/server';
import { getEntranceData } from '@/lib/pyqService';

export async function GET() {
  try {
    return NextResponse.json(getEntranceData());
  } catch (error) {
    console.error('Error in /api/entrance:', error);
    return NextResponse.json({ error: 'Failed to fetch entrance papers' }, { status: 500 });
  }
}
