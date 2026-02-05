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
Advanced Statistics for Business
Pick up where you left off
Module 0: Welcome to the Programme, Incomplete section

Module 1: Non - Parametric Methods, Incomplete section

1.0 Welcome to the Module, Incomplete
1.1 Parametric and Non - Parametric methods, Incomplete
1.2 Concept of Independence in Statistics, Incomplete
1.3 Concept of Goodness of fit test, Incomplete
1.4 Wilcoxon Signed Rank test, Incomplete
1.5 Recap, Incomplete
1.6 Learning Interludes, Incomplete
1.7 Discussion - Module 1, Incomplete
1.8 Key Takeaways, Completed
1.9 Handouts - Module 1, Completed
Module 2: Advanced Regression Methods, Incomplete section

2.0 Welcome to the Module, Incomplete
2.1 Linear Regression, Completed
2.2 Logistic Regression, Incomplete
2.3 Non - Linear Regression, Completed
2.4 Case Study, Incomplete
2.5 Recap, Incomplete
2.6 Learning Interludes, Incomplete
2.7 Discussion - Module 2, Incomplete
2.8 Key Takeaways, Incomplete
2.9 Handouts, Completed
Mid-Term 1, Completed section

Module 3: Predictive Analysis, Incomplete section

3.0 Welcome to the module, Incomplete
3.1 Concept of Forecasting, Completed
3.2 Linear Regression, Incomplete
3.3 Logistic Regression, Incomplete
3.4 Times Series data, Completed
3.5 Methods of Forecasting, Incomplete
3.6 Autocorrelation, Incomplete
3.7 Learning Interludes, Incomplete
3.8 Discussion - Module 3, Incomplete
3.9 Key Takeaways, Incomplete
3.10 Handouts, Completed
Module 4: Statistical Methods in Quality Management, Incomplete section

4.0 Welcome to the module, Incomplete
4.1 Statistics in Quality Management, Incomplete
4.2 Hypothesis Testing, Incomplete
4.3 Regression Analysis, Incomplete
4.4 Statistical Decision Theory, Incomplete
4.5 Statistical Process Control, Incomplete
4.6 Design of Experiments, Incomplete
4.7 Learning Interludes, Incomplete
4.8 Discussion - Module 4, Incomplete
4.9 Key Takeaways, Incomplete
4.10 Handouts