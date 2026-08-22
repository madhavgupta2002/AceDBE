import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isSafeSegment } from '@/lib/validatePath';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];

// Determine whether an image file name corresponds to the given question id/number.
// Image names look like "PME_Q5_587.png" where Q5 -> question number 5.
function fileMatchesQuestion(fileName: string, questionId: string): boolean {
    const base = fileName.replace(/\.[^.]+$/, '');
    const qNum = parseInt(questionId, 10);

    if (Number.isNaN(qNum)) {
        // Non-numeric question id: fall back to a simple substring match.
        return base.includes(questionId);
    }

    // Primary: match tokens like Q5 / q12 and compare the numeric part exactly.
    const qMatches = [...base.matchAll(/Q(\d+)/gi)].map((m) => parseInt(m[1], 10));
    if (qMatches.length > 0) {
        return qMatches.includes(qNum);
    }

    // Fallback: any standalone numeric token equals the question number.
    const tokens = base.split(/[^0-9]+/).filter(Boolean).map((t) => parseInt(t, 10));
    return tokens.includes(qNum);
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const bankType = searchParams.get('bankType');
    const subjectCode = searchParams.get('subjectCode');
    const bankName = searchParams.get('bankName');
    const questionId = searchParams.get('questionId');

    if (!bankType || !subjectCode || !bankName || !questionId) {
        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    if (!isSafeSegment(bankType) || !isSafeSegment(subjectCode) || !isSafeSegment(bankName)) {
        return NextResponse.json(
            { error: 'Invalid parameters' },
            { status: 400 }
        );
    }

    try {
        // Images live in a folder named exactly like the question bank (JSON without extension).
        const folderPath = path.join(
            process.cwd(),
            'public',
            'data',
            'Subjects',
            subjectCode,
            bankType,
            bankName
        );

        if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
            return NextResponse.json({ images: [] });
        }

        const files = fs
            .readdirSync(folderPath)
            .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .filter((file) => fileMatchesQuestion(file, questionId))
            .sort();

        // Build static public URLs (everything under /public is served from the web root).
        const encodedBank = encodeURIComponent(bankName);
        const images = files.map(
            (file) =>
                `/data/Subjects/${subjectCode}/${bankType}/${encodedBank}/${encodeURIComponent(file)}`
        );

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error resolving question image:', error);
        return NextResponse.json(
            { error: 'Failed to resolve question image' },
            { status: 500 }
        );
    }
}
