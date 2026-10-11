"""
Adds `exam_metadata.exam_pattern` to the Exam JSON files whose official pattern is known
(IIMB BBA-DBE exam pattern notices). Format: see QUESTION_FORMAT.md ("exam_pattern").

Sections are assigned to questions by walking the bank in file order, so `question_ids` is
generated here rather than typed by hand. Run from the repo root:

    python3 apply_exam_patterns.py          # adds patterns, skips files that already have one
    python3 apply_exam_patterns.py --check  # only verifies the section/question mapping
"""

import json
import re
import sys
from pathlib import Path

SUBJECTS_DIR = Path(__file__).parent / "public" / "data" / "Subjects"

SECTION_NAMES = {}


def S(name, qtype, n, marks=None, *, take=None, written=False, **kw):
    """One section. `take` = number of bank entries it consumes (defaults to n; 0 for written sections without mapped ids)."""
    return dict(name=name, question_type=qtype, num_questions=n, marks_per_question=marks,
                _take=(0 if written and take is None else (n if take is None else take)),
                _written=written, **kw)


def W(name, qtype, n, marks=None, **kw):
    """Written (non-CBT) section."""
    return S(name, qtype, n, marks, written=True, **kw)


def pattern(exam_name, duration, total_marks, sections, *, calculator="none", negative=False, timing="global",
            refs=(), notes=(), **kw):
    return dict(exam_name=exam_name, duration_min=duration, total_marks=total_marks, negative_marking=negative,
                calculator=calculator, timing_mode=timing, reference_materials=list(refs),
                instructions=list(notes), sections=sections, **kw)


B2T3, B2T2, B2T1 = "IIMB BBA DBE Batch 2 Term 3", "IIMB BBA DBE Batch 2 Term 2", "IIMB BBA DBE Batch 2 Term 1"
B1T6, B1T5, B1T4 = "IIMB BBA DBE Batch 1 Term 6", "IIMB BBA DBE Batch 1 Term 5", "IIMB BBA DBE Batch 1 Term 4"
B1T3 = "IIMB BBA DBE Batch 1 Term 3"
ROUGH = "Rough sheets are provided at the centre and must be returned immediately after the exam."
NO_NEG_100 = "No negative marking. 100 total marks per paper."
MSQ_NOTE = ("Section 2 contains Multiple Select Questions (MSQs). To score marks you must select all correct options "
            "for each question. No partial marks or grace marks are awarded for incomplete or partially correct selections.")

PATTERNS = {
    # ---------------- Batch 2, Term 3 (Sep 2026) ----------------
    "DS31x_B2/Exam/5 September 2026.json": pattern(
        B2T3, 60, 100, [S("Section 1", "MCQ", 20, 5)], calculator="scientific",
        refs=["Formula sheet", "Probability tables"],
        notes=[ROUGH, "Soft copies of the formula sheet and probability table are available in the 'Formula Sheet' section beside the MCQ section."]),
    "SE31x/Exam/5 September 2026.json": pattern(
        B2T3, 60, 100, [W("Section 1", "SUBJECTIVE", 4, 25, take=4)],
        notes=["Digital answers, up to 200 words each (you may exceed the word count if necessary)."]),
    "EP31x/Exam/5 September 2026.json": pattern(
        B2T3, 120, 100, [
            S("Section 1", "MCQ", 15, 1),
            S("Section 2", "MSQ", 20, 1.5, msq_scoring="exact"),
            S("Section 3", "TRUE_FALSE", 15, 1),
            S("Section 4", "SCENARIO_MCQ", 20, 1, note="4 scenarios, each followed by 5 MCQs"),
            S("Section 5", "MATCH_THE_FOLLOWING", 5, 2),
            S("Section 6", "SEQUENCE_MCQ", 5, 2),
        ], notes=[MSQ_NOTE]),
    "MK31x/Exam/6 September 2026.json": pattern(B2T3, 120, 75, [S("Section 1", "MCQ", 75, 1)]),
    "ID32x/Exam/6 September 2026.json": pattern(B2T3, 120, 100, [S("Section 1", "MCQ", 50, 2)]),

    # ---------------- Batch 2, Term 2 (May 2026) ----------------
    "SE21x/Exam/23 May 2026.json": pattern(B2T2, 60, 100, [S("Section 1", "MCQ", 40, 2.5)]),
    "ES21x/Exam/23 May 2026.json": pattern(B2T2, 60, 100, [S("Section 1", "MCQ", 40, 2.5)], calculator="standard", notes=[ROUGH]),
    "FA31x/Exam/23 May 2026.json": pattern(B2T2, 60, 75, [S("Section 1", "MCQ", 25, 3)], calculator="standard", notes=[ROUGH]),
    "ID22x/Exam/24 May 2026.json": pattern(B2T2, 120, 100, [S("Section 1", "MCQ", 50, 2)]),
    "DS21x_B2/Exam/24 May 2026.json": pattern(
        B2T2, 60, 100, [S("Section 1", "MCQ", 20, 5)], calculator="scientific",
        refs=["Formula sheet", "Probability tables"],
        notes=["The formula sheet and probability tables are included with the question paper."]),
    "AE21x/Exam/24 May 2026.json": pattern(B2T2, 60, 100, [S("Section 1", "MCQ", 40, 2.5)]),

    # ---------------- Batch 2, Term 1 (Jan/Feb 2026): no negative marking, 100 marks per paper ----------------
    "FA11x/Exam/31 January 2026.json": pattern(B2T1, 120, 100, [S("Section 1", "MCQ", 50)], notes=[NO_NEG_100]),
    "ST21x/Exam/31 January 2026.json": pattern(B2T1, 60, 100, [S("Section 1", "MCQ", 35)], notes=[NO_NEG_100]),
    "EP11x/Exam/31 January 2026.json": pattern(
        B2T1, 60, 100, [W("Section 1", "SUBJECTIVE", 4, take=4)],
        notes=["Entirely computer-based paper with 4 subjective questions."]),
    "EP12x/Exam/31 January 2026.json": pattern(B2T1, 60, 100, [S("Section 1", "MCQ", 35)], notes=[NO_NEG_100]),
    "MK11x/Exam/01 February 2026.json": pattern(B2T1, 120, 100, [S("Section 1", "MCQ", 50)], notes=[NO_NEG_100]),
    "AE11x/Exam/01 February 2026.json": pattern(B2T1, 60, 100, [S("Section 1", "MCQ", 35)], notes=[NO_NEG_100]),
    "DS11x_B2/Exam/1 February 2026.json": pattern(B2T1, 60, 100, [S("Section 1", "MCQ", 35)], notes=[NO_NEG_100]),

    # ---------------- Batch 1, Term 6 (Aug 2026) ----------------
    "MK61x/Exam/22 August 2026.json": pattern(
        B1T6, 120, 75, [
            S("Section A", "MCQ", 35, 1),
            S("Section B", "MSQ", 20, 2, msq_scoring="partial", max_selections=2,
              note="Each question has exactly two correct options and at most two options can be selected."),
        ],
        notes=["Section B scoring: both correct = 2 marks; one correct and no wrong option = 1 mark; any wrong option = 0 marks. "
               "There is no negative marking.",
               "To change a response, first untick a selected option (or use Clear Response); a third option cannot be ticked while two are selected."]),
    "MD62x/Exam/22 August 2026.json": pattern(
        B1T6, 120, 80, [
            S("Section A", "MCQ", 20, 2),
            W("Section B", "CASE_BASED", 4, 5, take=4, note="Case-based / application: each question presents a short scenario followed by a task."),
            W("Section C", "SUBJECTIVE", 2, 10, take=2, note="Subjective / descriptive: structured, complete response."),
        ], calculator="standard",
        notes=["Every question is self-contained; brand-specific numbers needed are stated in the question.",
               "For Sections B and C, structure the answer so each part of the question is addressed directly."]),
    "MD61x/Exam/23 August 2026.json": pattern(
        B1T6, 120, 100, [W("Section A", "SUBJECTIVE", 10, 10, take=10)],
        notes=["Questions are based on the inclusive business model case study shared two days before the exam."]),
    "OM61x/Exam/23 August 2026.json": pattern(
        B1T6, 120, 80, [
            S("Section A", "MCQ", 50, 1),
            W("Section B", "NUMERICAL", 6, 4, take=24, note="6 numericals (stored as 24 SUBJECTIVE entries in this bank). Marks go to the final answer within the stated tolerance."),
            S("Section C", "MATCH_THE_FOLLOWING", 3, 2),
        ], calculator="scientific",
        refs=["Standardised formula sheet", "Normal distribution tables"],
        notes=["The formula sheet and normal distribution tables are shown on the exam system.", ROUGH]),

    # ---------------- Batch 1, Term 5 (Jun 2026) ----------------
    "ES51x/Exam/6 June 2026.json": pattern(
        B1T5, 60, 70, [
            S("Section A", "MCQ", 20, 2, duration_min=15),
            W("Section B", "SHORT_ANSWER", 2, 5, duration_min=10),
            W("Section C", "CASE_BASED", 1, 10, duration_min=15, note="Choice of A or B"),
            W("Section D", "HIGHER_ORDER", 1, 10, duration_min=15, note="Choice of A or B"),
        ], timing="sectional",
        notes=["Revised pattern: 5 minutes are kept for cross-checking. The written sections are stored as 8 SUBJECTIVE entries in this bank."]),

    # ---------------- Batch 1, Term 4 (Feb 2026) ----------------
    "ST41x/Exam/14 February 2026.json": pattern(
        B1T4, 120, 100, [
            S("Section 1", "MCQ_MSQ", 20),
            W("Sections 2-3", "SHORT_ANSWER_AND_CASE_STUDY", 10, take=10, note="Short-answer questions and case studies."),
        ]),
    "MD42x/Exam/14 February 2026.json": pattern(B1T4, 60, 100, [S("Section 1", "MCQ", 50, 2)]),
    "MK41x/Exam/14 February 2026.json": pattern(B1T4, 120, 100, [S("Section 1", "MCQ", 40), W("Section 2", "SUBJECTIVE", 5, take=5)]),
    "OB41x/Exam/15 February 2026.json": pattern(
        B1T4, 120, 100, [
            S("Section 1", "MCQ", 10),
            S("Section 2", "MSQ", 25, msq_scoring="exact"),
            S("Section 3", "CASELET_MCQ", 30),
        ]),
    "OM41x/Exam/15 February 2026.json": pattern(
        B1T4, 60, 120, [S("Sections 1-5", "MCQ", 22)], calculator="scientific", negative=True,
        negative_marks_fraction=0.2,
        notes=["Negative marking: 20% of the marks assigned to a question is deducted for a wrong answer.", ROUGH]),

    # ---------------- Batch 1, Term 3 (Sep 2025) ----------------
    "FA31x/Exam/20 September 2025.json": pattern(B1T3, 60, 75, [S("Section 1", "MCQ", 25, 3)], calculator="standard"),
    "SE31x/Exam/25 September 2025.json": pattern(
        B1T3, 60, 100, [W("Section 1", "SUBJECTIVE", 4, 25, take=4)], notes=["Paper and pen exam."]),
    "EP31x/Exam/20 September 2025.json": pattern(
        B1T3, 120, 100, [
            S("Simple MCQs", "MCQ", 15, 1),
            S("MCQs with Multiple Correct Answers", "MSQ", 20, 1.5, msq_scoring="exact"),
            S("True/False questions", "TRUE_FALSE", 15, 1),
            S("Vignette (Scenario) based MCQs", "SCENARIO_MCQ", 20, 1, vignette=(4, 5),
              note="4 scenarios, each followed by 5 MCQs. The scenario text is stored as a SUBJECTIVE bank entry and shown as a passage."),
            S("Context based MCQs", "CONTEXT_MCQ", 5, 2),
            S("Sequence based MCQs", "SEQUENCE_MCQ", 5, 2),
        ]),
    "MK31x/Exam/21 September 2025.json": pattern(B1T3, 120, 75, [S("Section 1", "MCQ", 75, 1)]),
    "ID32x/Exam/20 September 2025.json": pattern(B1T3, 120, 100, [S("Section 1", "MCQ", 50, 2)]),
}


def assign_ids(rel, pat, questions):
    """Walk the bank in order and attach question_ids / context blocks to each section. Returns the cleaned pattern."""
    pos = 0
    out_sections = []

    def kind(q):
        return "S" if q.get("question_type") == "SUBJECTIVE" else "M"

    for sec in pat["sections"]:
        sec = dict(sec)
        take, written, vignette = sec.pop("_take"), sec.pop("_written"), sec.pop("vignette", None)
        ids, blocks = [], []
        if vignette:
            groups, per = vignette
            for _ in range(groups):
                ctx = questions[pos]
                assert kind(ctx) == "S", f"{rel}: expected a context entry at {pos}"
                pos += 1
                members = []
                for _ in range(per):
                    assert kind(questions[pos]) == "M", f"{rel}: bad vignette member at {pos}"
                    members.append(str(questions[pos]["question_id"]))
                    pos += 1
                blocks.append({"context_question_id": str(ctx["question_id"]), "applies_to": members})
                ids += members
        else:
            for _ in range(take):
                q = questions[pos]
                want = "S" if written else "M"
                assert kind(q) == want, f"{rel}: section {sec['name']} expected {want} at index {pos} (id {q['question_id']})"
                ids.append(str(q["question_id"]))
                pos += 1
            if written and take == 0:
                # skip nothing; ids stay empty (no CBT questions)
                pass
        if not written:
            assert len(ids) == sec["num_questions"], f"{rel}: {sec['name']} has {len(ids)} ids, expected {sec['num_questions']}"
        if ids:
            sec["question_ids"] = ids
        if blocks:
            sec["context_blocks"] = blocks
        sec = {k: v for k, v in sec.items() if v is not None}
        out_sections.append(sec)

    pat = dict(pat)
    pat["sections"] = out_sections
    pat["total_questions"] = sum(s["num_questions"] for s in out_sections)
    return pat


def insert_pattern(text, pat):
    m = re.search(r'"exam_metadata"\s*:\s*\{\n(\s+)"', text)
    if not m:
        raise ValueError("exam_metadata not found")
    indent = m.group(1)
    end = text.index("}", m.end())  # metadata values are plain strings, so the first } closes it
    body_end = text.rindex("\n", 0, end)
    block = json.dumps(pat, indent=2, ensure_ascii=False)
    # keep id lists on one line
    block = re.sub(r'\[\s+((?:"[^"\n]{1,20}",?\s+)*"[^"\n]{1,20}")\s+\]',
                   lambda m: "[" + re.sub(r",\s+", ", ", m.group(1)) + "]", block)
    block = block.replace("\n", "\n" + indent)
    return text[:body_end] + f',\n{indent}"exam_pattern": {block}' + text[body_end:]


def main():
    check_only = "--check" in sys.argv
    changed = 0
    for rel, pat in PATTERNS.items():
        path = SUBJECTS_DIR / rel
        if not path.exists():
            print(f"MISSING  {rel}")
            continue
        text = path.read_text(encoding="utf-8")
        data = json.loads(text)
        full = assign_ids(rel, pat, data["questions"])
        if check_only:
            print(f"ok       {rel}")
            continue
        if "exam_pattern" in data["exam_metadata"]:
            print(f"skip     {rel} (already has exam_pattern)")
            continue
        new = insert_pattern(text, full)
        json.loads(new)  # must stay valid
        path.write_text(new, encoding="utf-8")
        changed += 1
        print(f"patched  {rel}")
    print(f"{changed} file(s) changed")


if __name__ == "__main__":
    main()
