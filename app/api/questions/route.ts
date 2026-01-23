import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bankType = searchParams.get('bankType');
  const subjectCode = searchParams.get('subjectCode');
  const bankName = searchParams.get('bankName');

  if (!bankType || !subjectCode || !bankName) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Construct filename
    const filename = `${subjectCode} ${bankName}.json`;
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      bankType,
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Question file not found' },
        { status: 404 }
      );
    }

    // Read and parse JSON file
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}
