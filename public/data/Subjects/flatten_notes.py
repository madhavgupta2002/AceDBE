"""
Move each subject's Notes/{code}.md to NOTES.md at the subject root,
then remove the empty Notes folder.

Before: Subjects/{code}/Notes/{code}.md
After:  Subjects/{code}/NOTES.md
"""

import os
import shutil

SUBJECTS_DIR = os.path.dirname(os.path.abspath(__file__))

for subject in os.listdir(SUBJECTS_DIR):
    subject_dir = os.path.join(SUBJECTS_DIR, subject)
    if not os.path.isdir(subject_dir):
        continue

    notes_dir = os.path.join(subject_dir, "Notes")
    if not os.path.isdir(notes_dir):
        continue

    # Find the .md file inside Notes/
    md_files = [f for f in os.listdir(notes_dir) if f.endswith(".md")]
    if not md_files:
        print(f"  [SKIP] {subject}/Notes/ has no .md files")
        continue

    src = os.path.join(notes_dir, md_files[0])
    dest = os.path.join(subject_dir, "NOTES.md")
    shutil.move(src, dest)
    print(f"  {subject}/Notes/{md_files[0]} -> {subject}/NOTES.md")

    # Remove Notes folder if empty
    if not os.listdir(notes_dir):
        os.rmdir(notes_dir)

print("\nDone!")
