Here is the updated **`README.md`** reflecting the updated architecture and compilation workflow, with appropriate credit to the original repository.

---

# IIMBx Course Data Compiler

An extension designed to crawl and compile complete text lessons, video paths, quiz indexes, and transcript URLs from your enrolled IIMBx courses into a single structured database payload (`download.json`), with a companion Python script to systematically build and organize your offline folders.

This project is built upon the architecture of the original **IIMBx Transcript Downloader** repository, transitioning the file download and assembly mechanics from the browser sandbox to a highly reliable local Python processing script.

## How it works

The compiler operates through a two-stage process to bypass browser download limitations, directory restrictions, and connection drops:

### Stage 1: Browser Compilation (The Extension)
1. `GET /api/learner_home/init/` — lists your enrolled courses.
2. `GET /api/courses/v2/blocks/?course_id=…&depth=all` — returns the course structural map.
3. `GET /xblock/<vertical-block>?view=student_view` — fetches unit payloads in parallel.
4. Aggregates all structural outlines, plain text modules, YouTube streaming IDs, and transcript URLs into a single structured JSON file: **`download.json`**.

### Stage 2: Local Processing (Companion Python Script)
1. You run `organize_iimbx.py` directly inside your `Downloads` directory.
2. The script parses `download.json` and creates a structured directory tree for each course.
3. It converts HTML blocks into clean formatting templates (`Text.txt`), writes video maps (`Videos.json`), and creates direct hyperlinked indices for assessments (`Practice Questions.txt`).
4. It downloads all PDFs sequentially using Python’s standard library, ensuring stable file saving.

---

## Output Folder Structure

After compiling and running the organizer script, your local directory is structured as follows:

```text
Downloads/
├── organize_iimbx.py
└── IIMBx Parsed/
    ├── download.json               <-- Moved here after processing
    └── <Course Name>/
        ├── Videos.json             <-- Unified video playlist mapping for all course modules
        ├── Joined Transcripts/     <-- Combined module PDFs (one merged PDF per module)
        │   └── <Module Name>.pdf
        └── <Module or Chapter Name>/
            ├── Text.txt                <-- All formatted reading/lesson text
            ├── Transcript.txt          <-- All original transcript URLs
            ├── Practice Questions.txt  <-- Direct clickable links to quizzes
            └── Transcripts/
                ├── Lesson_1_Transcript.pdf
                └── Lesson_2_Transcript.pdf
```

---

## Installation

### 1. Extension Setup
1. Download or clone this repository.
2. Open your browser and navigate to `chrome://extensions` (or `brave://extensions`).
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and select this repository folder.

### 2. Python Script Setup
Create a file named `organize_iimbx.py` in your browser's default `Downloads` folder, paste the provided Python script code inside it, and save.

---

## Usage

1. Log in to IIMBx in your browser.
2. Click the extension icon to view your enrolled courses.
3. Search and select the subjects you want to back up, then click **Compile Selected**.
4. Wait for the compilation progress bar to reach 100%. The browser will download a single **`download.json`** file.
5. Ensure both `download.json` and `organize_iimbx.py` are inside your `Downloads` folder.
6. Open your terminal or Command Prompt inside your `Downloads` directory and run:
   ```bash
   python organize_iimbx.py
   ```
7. The terminal will print sequential download progress for your PDFs. Once complete, your structured assets will be organized inside the newly created `IIMBx Parsed/` folder.

---

## Permissions

*   `downloads` — Save the compiled `download.json` file.
*   `storage`, `unlimitedStorage` — Maintain caching and crawling states between worker lifecycles.
*   Host Permission: `https://apps.iimbx.edu.in/*`, `https://iimbx.edu.in/*` — Standard authenticated requests to course structures.

---

## Credits

This compiler was developed as an evolutionary fork of https://github.com/tahcin/iimbx-transcript-downloader
