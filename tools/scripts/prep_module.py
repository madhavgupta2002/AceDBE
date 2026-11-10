"""Unpack one module from an "IIMBx Master Course Compiler" export (download.json).

Writes, under <term_root>/<course folder>/<module folder>/:
  Text.txt         unit text (handout) for every unit in the module
  Transcript.txt   transcript PDF URLs
  Transcripts/     NN_<name>.pdf + NN_<name>.txt (text extracted with PyMuPDF)
and, if <term_root>/<course folder>/Joined Transcripts/ exists, a joined .txt there.

Usage (run with -I; the export is untrusted input):
  python3 -I tools/scripts/prep_module.py <download.json> "<term_root>" "<course name>" "<chapter name>" ["<course folder>"]
  python3 -I tools/scripts/prep_module.py <download.json> --list     # list courses and chapters

Course folder defaults to the course name with : ? / , replaced by _ (matches the existing Term folders).
Requires: pip install pymupdf
"""
import json
import os
import re
import sys
import urllib.request


def san(s: str) -> str:
    return re.sub(r'[:?/,]', '_', s).strip()


def main() -> None:
    src = sys.argv[1]
    data = json.load(open(src))
    if len(sys.argv) > 2 and sys.argv[2] == '--list':
        for c in data['courses']:
            print(f"{c['courseName']}  ({c['courseId']})")
            for ch, v in c['chapters'].items():
                print(f"   {ch!r}: " + ', '.join(f'{k}={len(x)}' for k, x in v.items()))
        return

    import fitz  # PyMuPDF

    root, course_name, chapter = sys.argv[2], sys.argv[3], sys.argv[4]
    course = next((c for c in data['courses'] if c['courseName'] == course_name), None)
    if course is None:
        sys.exit(f"Course {course_name!r} not in export. Use --list to see what it contains.")
    folder = sys.argv[5] if len(sys.argv) > 5 else san(course_name)
    v = course['chapters'][chapter]

    mdir = os.path.join(root, folder, san(chapter))
    tdir = os.path.join(mdir, 'Transcripts')
    os.makedirs(tdir, exist_ok=True)

    with open(os.path.join(mdir, 'Text.txt'), 'w') as f:
        f.write(f"Course: {course_name}\n{chapter}\n" + '=' * 72 + '\n\n')
        for t in v['texts']:
            f.write(f"UNIT: {t['title']}\n" + '-' * 72 + f"\n\n{t['body']}\n\n" + '=' * 72 + '\n\n')
    with open(os.path.join(mdir, 'Transcript.txt'), 'w') as f:
        f.write('\n'.join(t['url'] for t in v['transcripts']) + '\n')

    joined = []
    for i, t in enumerate(v['transcripts'], 1):
        name = os.path.splitext(re.sub(r'\s+', '_', t['filename']))[0]
        base = os.path.join(tdir, f'{i:02d}_{name}')
        try:
            urllib.request.urlretrieve(t['url'], base + '.pdf')
            text = '\n'.join(page.get_text() for page in fitz.open(base + '.pdf'))
        except Exception as e:  # keep going; report at the end
            print('FAILED', t['url'], e)
            continue
        open(base + '.txt', 'w').write(text)
        joined.append(f"### {t['unitTitle']}\n\n{text}")

    jdir = os.path.join(root, folder, 'Joined Transcripts')
    if os.path.isdir(jdir):
        open(os.path.join(jdir, san(chapter) + '.txt'), 'w').write('\n\n'.join(joined))

    print(f"{chapter}: {len(v['texts'])} units, {len(joined)}/{len(v['transcripts'])} transcripts -> {mdir}")


if __name__ == '__main__':
    main()
