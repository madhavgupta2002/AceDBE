import json
import os
from pathlib import Path

subjects_dir = Path(__file__).parent

# Fix module type in all JSONs
for json_file in subjects_dir.rglob("*.json"):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data.get("questions", [])
    if not questions:
        continue

    module_converted = False
    for q in questions:
        if isinstance(q.get("module"), str):
            q["module"] = int(q["module"])
            module_converted = True

    if module_converted:
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Fixed modules: {json_file.relative_to(subjects_dir)}")

# Sort questions by ID in Exam JSONs
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
