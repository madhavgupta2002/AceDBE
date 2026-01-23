import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bankType = searchParams.get('bankType');
  const subjectCode = searchParams.get('subjectCode');

  if (!bankType || !subjectCode) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const dirPath = path.join(process.cwd(), 'public', 'data', bankType);

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ banks: [] });
    }

    // Read all files in the directory
    const files = fs.readdirSync(dirPath);
    
    // Filter files that match the subject code and extract bank names
    const banks: string[] = [];
    const prefix = `${subjectCode} `;
    
    files.forEach((file) => {
      if (file.startsWith(prefix) && file.endsWith('.json')) {
        // Extract bank name by removing prefix and .json extension
        const bankName = file.slice(prefix.length, -5); // Remove prefix and .json
        banks.push(bankName);
      }
    });

    return NextResponse.json({ banks });
  } catch (error) {
    console.error('Error getting banks:', error);
    return NextResponse.json(
      { error: 'Failed to get banks' },
      { status: 500 }
    );
  }
}
