import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BankInfo {
  bankName: string;
  displayName: string;
}

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
    const banks: BankInfo[] = [];
    const prefix = `${subjectCode} `;
    
    files.forEach((file) => {
      if (file.startsWith(prefix) && file.endsWith('.json')) {
        // Extract bank name by removing prefix and .json extension
        const bankName = file.slice(prefix.length, -5); // Remove prefix and .json
        
        // For Exam type, read the exam_date from metadata
        if (bankType === 'Exam') {
          try {
            const filePath = path.join(dirPath, file);
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContents);
            const examDate = data.exam_metadata?.exam_date || bankName;
            banks.push({ bankName, displayName: examDate });
          } catch (error) {
            // If reading fails, use bank name as fallback
            banks.push({ bankName, displayName: bankName });
          }
        } else {
          // For CLA, use bank name as display name
          banks.push({ bankName, displayName: bankName });
        }
      }
    });

    // Sort Exam banks by date (newest first)
    if (bankType === 'Exam') {
      banks.sort((a, b) => {
        // Parse dates (assuming format DD/MM/YYYY)
        const dateA = a.displayName.split('/').reverse().join('-');
        const dateB = b.displayName.split('/').reverse().join('-');
        return dateB.localeCompare(dateA);
      });
    }

    return NextResponse.json({ banks });
  } catch (error) {
    console.error('Error getting banks:', error);
    return NextResponse.json(
      { error: 'Failed to get banks' },
      { status: 500 }
    );
  }
}
