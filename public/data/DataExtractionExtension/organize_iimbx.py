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

def merge_pdfs(pdf_list, output_path):
    if not pdf_list:
        return False

    # 1. Try pypdf
    try:
        from pypdf import PdfWriter
        merger = PdfWriter()
        added_count = 0
        for pdf in pdf_list:
            try:
                merger.append(pdf)
                added_count += 1
            except Exception:
                pass
        if added_count > 0:
            merger.write(output_path)
            merger.close()
            return True
    except Exception:
        pass

    # 2. Try PyPDF2
    try:
        from PyPDF2 import PdfMerger
        merger = PdfMerger()
        added_count = 0
        for pdf in pdf_list:
            try:
                merger.append(pdf)
                added_count += 1
            except Exception:
                pass
        if added_count > 0:
            merger.write(output_path)
            merger.close()
            return True
    except Exception:
        pass

    # 3. Try PyMuPDF (fitz)
    try:
        import fitz
        result_pdf = fitz.open()
        added_count = 0
        for pdf in pdf_list:
            try:
                with fitz.open(pdf) as pdf_doc:
                    result_pdf.insert_pdf(pdf_doc)
                    added_count += 1
            except Exception:
                pass
        if added_count > 0:
            result_pdf.save(output_path)
            result_pdf.close()
            return True
    except Exception:
        pass

    return False

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
            folder_prefix = os.path.join("IIMBx Parsed", course_name, safe_chapter)
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

            # 4. Generate Transcript.txt index, download PDFs & merge into single module PDF
            transcripts = storage.get("transcripts", [])
            if transcripts:
                urls_list = "\n".join([t['url'] for t in transcripts])
                trans_index_path = os.path.join(folder_prefix, "Transcript.txt")
                with open(trans_index_path, 'w', encoding='utf-8') as trf:
                    trf.write(urls_list)
                print("   [WRITTEN] Transcript.txt index")

                pdf_folder = os.path.join(folder_prefix, "Transcripts")
                os.makedirs(pdf_folder, exist_ok=True)

                downloaded_pdf_paths = []
                print(f"   [DOWNLOADING] Downloading {len(transcripts)} PDFs...")
                for idx, t in enumerate(transcripts):
                    pdf_url = t['url']
                    pdf_basename = t['filename'].replace('.pdf', '') if t['filename'] else t['unitTitle']
                    safe_pdf_name = f"{sanitize_name(pdf_basename)}.pdf"
                    pdf_path = os.path.join(pdf_folder, safe_pdf_name)

                    if not os.path.exists(pdf_path):
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

                    if os.path.exists(pdf_path):
                        downloaded_pdf_paths.append(pdf_path)

                if downloaded_pdf_paths:
                    joined_folder = os.path.join("IIMBx Parsed", course_name, "Joined Transcripts")
                    os.makedirs(joined_folder, exist_ok=True)
                    joined_pdf_path = os.path.join(joined_folder, f"{safe_chapter}.pdf")
                    print(f"   [MERGING] Merging {len(downloaded_pdf_paths)} PDFs into module transcript PDF...")
                    if merge_pdfs(downloaded_pdf_paths, joined_pdf_path):
                        print(f"   [JOINED] Saved: Joined Transcripts/{safe_chapter}.pdf")
                    else:
                        print("   [WARNING] Could not merge PDFs (install 'pypdf', 'PyPDF2', or 'pymupdf').")

        # Write Master Videos.json inside the root Course folder
        if master_videos:
            course_root_folder = os.path.join("IIMBx Parsed", course_name)
            os.makedirs(course_root_folder, exist_ok=True)
            video_path = os.path.join(course_root_folder, "Videos.json")
            with open(video_path, 'w', encoding='utf-8') as vf:
                json.dump(master_videos, vf, indent=4)
            print(f"\n[WRITTEN] Master Videos.json saved in the subject root folder.")

    # Move the unified payload database file into the top-level 'IIMBx Parsed' directory
    try:
        parsed_dir = "IIMBx Parsed"
        os.makedirs(parsed_dir, exist_ok=True)
        dest_json_path = os.path.join(parsed_dir, os.path.basename(json_filepath))
        shutil.move(json_filepath, dest_json_path)
        print(f"\nMoved {json_filepath} to: {dest_json_path}")
    except Exception as e:
        print(f"\n[WARNING] Could not move database file: {str(e)}")

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
    print("\nProcess finished! Your folders are organized under 'IIMBx Parsed/'.")

if __name__ == '__main__':
    main()