"""
Renames all Exam JSON files to use their exam_metadata.exam_date as the filename.
E.g. "Set 1.json" -> "12 January 2025.json"
"""

import json
import os
from pathlib import Path

SUBJECTS_DIR = Path(__file__).resolve().parents[2] / "public" / "data" / "Subjects"


def main():
    exam_jsons = list(SUBJECTS_DIR.rglob("Exam/*.json"))

    if not exam_jsons:
        print("No exam JSON files found.")
        return

    renames = []

    for filepath in exam_jsons:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        exam_date = data.get("exam_metadata", {}).get("exam_date")
        if not exam_date:
            print(f"SKIP (no exam_date): {filepath}")
            continue

        new_name = exam_date + ".json"
        new_path = filepath.parent / new_name

        if new_path == filepath:
            print(f"UNCHANGED: {filepath.name}")
            continue

        if new_path.exists():
            print(f"CONFLICT (target already exists, skipping): {filepath} -> {new_name}")
            continue

        renames.append((filepath, new_path))

    if not renames:
        print("Nothing to rename.")
        return

    print(f"\nPlanned renames ({len(renames)}):")
    for old, new in renames:
        print(f"  {old.parent.parent.name}/{old.parent.name}/{old.name}  ->  {new.name}")

    confirm = input("\nProceed? [y/N]: ").strip().lower()
    if confirm != "y":
        print("Aborted.")
        return

    for old, new in renames:
        os.rename(old, new)
        print(f"  Renamed: {old.name} -> {new.name}")

    print("\nDone.")


if __name__ == "__main__":
    main()
