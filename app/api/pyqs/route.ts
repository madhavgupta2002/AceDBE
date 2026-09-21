import { NextResponse } from 'next/server';
import { getPyqData } from '@/lib/pyqService';

export async function GET() {
  try {
    const data = getPyqData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/pyqs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PYQ data' },
      { status: 500 }
    );
  }
}
