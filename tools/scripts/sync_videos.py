"""Merge module videos from a course-compiler export (download.json) into a subject's videos.json.

Keys are module numbers ("1", "2", ...) plus "Live Session". Module 0, Mid-Term and other
non-module chapters are skipped (the tracker only counts numbered keys). Keys already in
videos.json that the export doesn't have are kept; keys it has are replaced.

Usage:
  python3 -I tools/scripts/sync_videos.py <download.json> "<course name>" public/data/Subjects/<CODE>/videos.json [more videos.json copies...]
"""
import json
import re
import sys


def main() -> None:
    src, course_name, targets = sys.argv[1], sys.argv[2], sys.argv[3:]
    courses = json.load(open(src))['courses']
    course = next((c for c in courses if c['courseName'] == course_name), None)
    if course is None:
        sys.exit(f"Course {course_name!r} not in export. Available: {[c['courseName'] for c in courses]}")

    new = {}
    for chapter, v in course['chapters'].items():
        m = re.match(r'Module (\d+)', chapter)
        key = m.group(1) if m else ('Live Session' if chapter.strip() == 'Live Session' else None)
        if key and key != '0' and v['videos']:
            new[key] = v['videos']

    for path in targets:
        cur = json.load(open(path))
        out = {**cur, **new}
        ordered = sorted((k for k in out if k.isdigit()), key=int) + [k for k in out if not k.isdigit()]
        out = {k: out[k] for k in ordered}
        changed = sorted(k for k in out if cur.get(k) != out[k])
        open(path, 'w').write(json.dumps(out, indent=4) + '\n')
        print(path, 'changed:', changed or 'nothing')


if __name__ == '__main__':
    main()
