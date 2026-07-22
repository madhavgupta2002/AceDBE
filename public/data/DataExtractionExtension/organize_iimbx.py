#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import json
import urllib.request
import shutil
import re

def sanitize_name(name):
    # Sanitize characters to match standard OS filesystem structures
    return "".join([c if c.isalnum() or c in " .-_()" else "_" for f in name for c in f]).strip()

def get_module_key(chapter_name):
    # If the chapter is a Module (e.g. "Module 1 - Intro"), extract "1"
    match = re.search(r'Module\s*(\d+)', chapter_name, re.IGNORECASE)
    if match:
        return match.group(1)
    return chapter_name

def process_payload(json_filepath):
    print(f"\nReading dataset payload: {json_filepath}...")
    try:
        with open(json_filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read JSON file: {str(e)}")
        return

    courses = data.get("courses", [])
    print(f"Discovered {len(courses)} compiled subject(s) inside this archive.")

    for course_data in courses:
        course_name = sanitize_name(course_data.get("courseName", "Course"))
        chapters = course_data.get("chapters", {})
        
        print(f"\n{'='*60}")
        print(f"PROCESSING COURSE: {course_name}")
        print(f"{'='*60}")

        # Master video directory index for the entire course
        master_videos = {}

        for chap_name, storage in chapters.items():
            safe_chapter = sanitize_name(chap_name)
            folder_prefix = os.path.join("Transcripts", course_name, safe_chapter)
            os.makedirs(folder_prefix, exist_ok=True)

            print(f"\n-> Folder: {safe_chapter}")

            # 1. Generate Chapter Text.txt
            texts = storage.get("texts", [])
            if texts:
                combined_text = f"Course: {course_name}\n{chap_name}\n{'='*72}\n\n"
                for item in texts:
                    combined_text += f"UNIT: {item['title']}\n{'-'*72}\n\n"
                    combined_text += f"{item['body']}\n\n{'='*72}\n\n"
                text_path = os.path.join(folder_prefix, "Text.txt")
                with open(text_path, 'w', encoding='utf-8') as tf:
                    tf.write(combined_text)
                print("   [WRITTEN] Text.txt")

            # 2. Accumulate Videos for Master Videos.json
            videos = storage.get("videos", [])
            if videos:
                module_key = get_module_key(chap_name)
                master_videos[module_key] = videos

            # 3. Generate Practice Questions.txt
            questions = storage.get("questions", [])
            if questions:
                qa_index = f"Practice and Assessments links for: {chap_name}\n\n"
                for idx, q in enumerate(questions):
                    qa_index += f"{idx + 1}. {q['title']}\nLink: {q['url']}\n\n"
                qa_path = os.path.join(folder_prefix, "Practice Questions.txt")
                with open(qa_path, 'w', encoding='utf-8') as qf:
                    qf.write(qa_index)
                print(f"   [WRITTEN] Practice Questions.txt ({len(questions)} links)")

            # 4. Generate Transcript.txt index and download PDFs
            transcripts = storage.get("transcripts", [])
            if transcripts:
                urls_list = "\n".join([t['url'] for t in transcripts])
                trans_index_path = os.path.join(folder_prefix, "Transcript.txt")
                with open(trans_index_path, 'w', encoding='utf-8') as trf:
                    trf.write(urls_list)
                print("   [WRITTEN] Transcript.txt index")

                pdf_folder = os.path.join(folder_prefix, "Transcripts")
                os.makedirs(pdf_folder, exist_ok=True)

                print(f"   [DOWNLOADING] Downloading {len(transcripts)} PDFs...")
                for idx, t in enumerate(transcripts):
                    pdf_url = t['url']
                    pdf_basename = t['filename'].replace('.pdf', '') if t['filename'] else t['unitTitle']
                    safe_pdf_name = f"{sanitize_name(pdf_basename)}.pdf"
                    pdf_path = os.path.join(pdf_folder, safe_pdf_name)

                    if os.path.exists(pdf_path):
                        continue

                    try:
                        req = urllib.request.Request(
                            pdf_url, 
                            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                        )
                        with urllib.request.urlopen(req, timeout=15) as response, open(pdf_path, 'wb') as out_file:
                            shutil.copyfileobj(response, out_file)
                        print(f"     ({idx+1}/{len(transcripts)}) Downloaded: {safe_pdf_name}")
                    except Exception as dl_err:
                        print(f"     [ERROR] Failed to download {safe_pdf_name}: {str(dl_err)}")

        # Write Master Videos.json inside the root Course folder
        if master_videos:
            course_root_folder = os.path.join("Transcripts", course_name)
            os.makedirs(course_root_folder, exist_ok=True)
            video_path = os.path.join(course_root_folder, "Videos.json")
            with open(video_path, 'w', encoding='utf-8') as vf:
                json.dump(master_videos, vf, indent=4)
            print(f"\n[WRITTEN] Master Videos.json saved in the subject root folder.")

    # Safely clean up the unified payload database after execution
    try:
        os.remove(json_filepath)
        print(f"\nSuccessfully cleaned up database file: {json_filepath}")
    except Exception:
        pass

def main():
    print("=========================================================")
    print("IIMBx Unified Database Organizer & Downloader")
    print("=========================================================")
    
    target_file = 'download.json'
    if not os.path.exists(target_file):
        print(f"Error: '{target_file}' not found.")
        print("Please verify that 'download.json' is located in the same directory as this script.")
        return

    process_payload(target_file)
    print("\nProcess finished! Your folders are organized under 'Transcripts/'.")

if __name__ == '__main__':
    main()