import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getTermForSubject } from '@/lib/subjectMapping';

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
    // Get the term for this subject to find the correct folder
    const term = getTermForSubject(subjectCode);
    const termFolder = `Term ${term}`;

    // Construct filename - now just the bank name
    const filename = `${bankName}.json`;
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      bankType,
      termFolder,
      subjectCode,
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
