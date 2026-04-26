"""
Reorganize data folder from:
  data/CLA/{subject}/...
  data/Custom/{subject}/...
  data/Exam/{subject}/...
  data/Notes/{subject}.md

To:
  data/Subjects/{subject}/CLA/...
  data/Subjects/{subject}/Custom/...
  data/Subjects/{subject}/Exam/...
  data/Subjects/{subject}/Notes/{subject}.md
"""

import os
import shutil

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
SUBJECTS_DIR = os.path.join(DATA_DIR, "Subjects")
BANK_TYPES = ["CLA", "Custom", "Exam"]

os.makedirs(SUBJECTS_DIR, exist_ok=True)

# 1. Move bank type folders (CLA, Custom, Exam) — each contains subject subfolders
for bank_type in BANK_TYPES:
    bank_path = os.path.join(DATA_DIR, bank_type)
    if not os.path.isdir(bank_path):
        continue
    for subject in os.listdir(bank_path):
        src = os.path.join(bank_path, subject)
        if not os.path.isdir(src):
            continue
        dest = os.path.join(SUBJECTS_DIR, subject, bank_type)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.move(src, dest)
        print(f"  {bank_type}/{subject}/ -> Subjects/{subject}/{bank_type}/")
    # Remove empty bank type folder
    if not os.listdir(bank_path):
        os.rmdir(bank_path)
        print(f"  Removed empty folder: {bank_type}/")

# 2. Move Notes — .md files become Subjects/{subject}/Notes/{subject}.md
notes_path = os.path.join(DATA_DIR, "Notes")
if os.path.isdir(notes_path):
    for filename in os.listdir(notes_path):
        if not filename.endswith(".md"):
            continue
        subject = filename[:-3]  # strip .md
        src = os.path.join(notes_path, filename)
        dest_dir = os.path.join(SUBJECTS_DIR, subject, "Notes")
        os.makedirs(dest_dir, exist_ok=True)
        shutil.move(src, os.path.join(dest_dir, filename))
        print(f"  Notes/{filename} -> Subjects/{subject}/Notes/{filename}")
    if not os.listdir(notes_path):
        os.rmdir(notes_path)
        print(f"  Removed empty folder: Notes/")

print("\nDone! New structure: data/Subjects/{subject}/{CLA,Custom,Exam,Notes}/")
