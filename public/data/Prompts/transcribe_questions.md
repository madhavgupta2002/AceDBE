Analyze the question PDF data and reformat it strictly using the provided schema.

Rules:
- Do not add or remove fields.
- Do not invent or modify content.
- If date nto mentioned then Exam date is going to be "Batch 1", otherwise in format DD Month 202Y (if it looks like a response sheet for an exam then create a batch and attempt names key with empty string under exam metadata too)
- Preserve question text, options, correct_option_label, explanations, and module numbers exactly.
- Provide a short 2-3  line explaination based on correct answer, maths questions should have a proper step by step explaiantion
- Ensure the output follows valid JSON structure.
- The module/cla number .pdf is the module number or it can be inferred from the syllabus
- you can use markdown and latex and tables etc to format questions, answers or exlpaiantions
-Never omit or shorten any question  or option, give full text as it is 
- if its a non mcq questions write question type "SUBJECTIVE" and put answer in explanation and omit options
- for exams , it should be sorted by question ID if mentioned
- for EXAMS only: if the official exam pattern notice is available (sections, marks, negative marking, duration, calculator, instructions), add it as "exam_pattern" inside exam_metadata exactly as in the schema below. Omit "exam_pattern" entirely when the pattern is not known - never guess it. Do not add it to CLA banks.
- if there is a paragraph or reference to context question for multiple qs,  write when it appears first and then later tell to refer that question for context, 

Schema:

{
  "exam_metadata": {
    "subject_name": "string",
    "exam_date": "string",
    "batch": ""    (empty and keeep only for exams)
    "attempt": "" (empty and keeep only for exams),
    "exam_pattern": {   (exams only, optional - see rules)
      "exam_name": "IIMB BBA DBE Batch 2 Term 3",
      "duration_min": 120,
      "total_marks": 100,
      "total_questions": 80,
      "negative_marking": false,
      "negative_marks_fraction": 0.2,   (only when negative marking is a share of the question's marks)
      "calculator": "none | standard | scientific",
      "timing_mode": "global | sectional",
      "reference_materials": ["Formula sheet"],
      "instructions": ["any special instruction from the notice, one per item"],
      "sections": [
        {
          "name": "Section 1",
          "question_type": "MCQ | MSQ | TRUE_FALSE | SCENARIO_MCQ | CASELET_MCQ | CONTEXT_MCQ | MATCH_THE_FOLLOWING | SEQUENCE_MCQ | NUMERICAL | SHORT_ANSWER | CASE_BASED | SUBJECTIVE",
          "num_questions": 15,
          "marks_per_question": 1,
          "negative_marks_per_question": 0,   (optional)
          "duration_min": 15,                 (optional, only for sectional timing)
          "msq_scoring": "exact | partial",   (optional, MSQ only; partial = marks x correct selected / total correct, 0 if any wrong option is selected)
          "max_selections": 2,                (optional, MSQ only)
          "question_ids": ["1", "2"],         (the bank question_ids that belong to this section, in order; omit for written sections that are not in this file)
          "context_blocks": [{"context_question_id": "51", "applies_to": ["52", "53"]}],  (optional: a SUBJECTIVE entry that only holds a shared scenario)
          "note": "free text"                 (optional)
        }
      ]
    }
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
