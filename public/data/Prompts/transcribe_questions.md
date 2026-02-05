Analyze the question PDF data and reformat it strictly using the provided schema.

Rules:
- Do not add or remove fields.
- Do not invent or modify content.
- If date nto mentioned then Exam date is going to be "Batch 1", otherwise in format DD Month 202Y
- Preserve question text, options, correct_option_label, explanations, and module numbers exactly.
- Provide a short 2-3  line explaination based on correct answer, maths questions should have a proper step by step explaiantion
- Ensure the output follows valid JSON structure.
- The module/cla number .pdf is the module number or it can be inferred from the syllabus
- you can use markdown and latex and tables etc to format questions, answers or exlpaiantions
-Never omit or shorten any question  or option, give full text as it is 
- if its a non mcq questions write question type "SUBJECTIVE" and put answer in explanation and omit options
- for exams , it should be sorted by question ID if mentioned
- if there is a paragraph or reference to context question for multiple qs,  write when it appears first and then later tell to refer that question for context, 

Schema:

{
  "exam_metadata": {
    "subject_name": "string",
    "exam_date": "string"
  },
  "questions": [
    {
      "question_id": "string",
      "question_text": "string",
      "question_type": "MCQ",
      "options": {
        "A": "string",
        "B": "string",
        "C": "string",
        "D": "string"
      },
      "correct_option_label": "A | B | C | D", (it can be multiple correct too then use comma between options"
      "explanation": "string",
      "module": "number" (1/2/3/4)
    }
  ]
}
Syllabus:
