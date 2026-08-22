import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isSafeSegment } from '@/lib/validatePath';

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

  if (!isSafeSegment(bankType) || !isSafeSegment(subjectCode)) {
    return NextResponse.json(
      { error: 'Invalid parameters' },
      { status: 400 }
    );
  }

  try {
    const subjectPath = path.join(process.cwd(), 'public', 'data', 'Subjects', subjectCode, bankType);
    if (!fs.existsSync(subjectPath)) {
      return NextResponse.json({ banks: [] });
    }

    // Read all files in the bank type directory
    const files = fs.readdirSync(subjectPath);

    // Extract bank names from JSON files
    const banks: BankInfo[] = [];

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        // Extract bank name by removing .json extension
        const bankName = file.slice(0, -5); // Remove .json

        // For Exam type, read the exam_date from metadata
        if (bankType === 'Exam') {
          try {
            const filePath = path.join(subjectPath, file);
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContents);
            const examDate = data.exam_metadata?.exam_date || bankName;
            banks.push({ bankName, displayName: examDate });
          } catch (error) {
            // If reading fails, use bank name as fallback
            banks.push({ bankName, displayName: bankName });
          }
        } else if (bankType === 'Custom') {
          // For Custom quizzes, use the filename as display name
          banks.push({ bankName, displayName: bankName });
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
