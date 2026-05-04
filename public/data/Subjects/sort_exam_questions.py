import json
import os
from pathlib import Path

subjects_dir = Path(__file__).parent

for exam_file in subjects_dir.rglob("Exam/*.json"):
    with open(exam_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data.get("questions", [])
    if not questions:
        continue

    sorted_questions = sorted(questions, key=lambda q: float(q["question_id"]))

    if sorted_questions == questions:
        continue

    data["questions"] = sorted_questions
    with open(exam_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"Sorted: {exam_file.relative_to(subjects_dir)}")

print("Done.")
