# AceDBE - IIMB BBA-DBE Practice Portal

Your complete practice platform for IIMB BBA-DBE courses, supporting 7 subjects with CLA and Exam question banks.

## Features

- **7 Subjects**: AE11x, DS11x, EP11x, EP12x, FA11x, MK11x, ST21x
- **Question Bank Types**: CLA (Continuous Learning Assessment) and Exam
- **Practice Modes**: Modulewise practice or full practice across all banks
- **Question Ordering**: Random or in-order
- **Dark Mode**: Toggle between light and dark themes
- **Progress Tracking**: Real-time statistics and answer tracking
- **Keyboard Navigation**: Arrow keys for navigation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
iimb-practice/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── quiz/              # Quiz pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── QuizApp.tsx        # Main quiz component
│   ├── QuizQuestion.tsx   # Question display
│   ├── SubjectSelector.tsx
│   └── ...
├── lib/                   # Utilities
│   ├── types.ts           # TypeScript types
│   ├── questionLoader.ts  # Question loading logic
│   └── subjectMapping.ts  # Subject mappings
├── public/
│   └── data/              # Question JSON files
│       ├── CLA/
│       └── Exam/
└── contexts/              # React contexts
    └── DarkModeContext.tsx
```

## Question File Format

Questions are stored as JSON files in `public/data/` organized by bank type (CLA/Exam) and subject code.

Example structure:
```json
{
  "exam_metadata": {
    "subject_name": "Business Statistics",
    "exam_date": "Mid Term Batch 1"
  },
  "questions": [
    {
      "question_id": "STAT_MT_Q1",
      "question_text": "Question text here...",
      "question_type": "MCQ",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correct_option_label": "D",
      "module": "Mid-Term"
    }
  ]
}
```

## Usage

1. Select a subject from the home page
2. Choose question bank type (CLA or Exam)
3. Select practice mode (Modulewise or Full practice)
4. Choose question order (Random or In Order)
5. Select a specific bank (if in bank mode)
6. Start practicing!

## Technologies

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

## License

Private project for IIMB course practice.
