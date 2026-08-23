Here's the extracted format specification:

---

## Short Notes Format Guide

### 1. Document Structure

```
## MODULE {n}: {Module Title}

---

### {Topic Name}

{Content Block: Tables / Formulas / Bullets}

{Question Block}

---

### {Next Topic}
...

---

## Quick Reference: {Summary Title}
## Key Decision Rules Summary
```

---

### 2. Content Block Patterns

**Pattern A — Concept Table** (most common; for definitions, classifications, comparisons):

```markdown
| Column1 | Column2 | Column3 |
|---------|---------|---------|
| **Bold Term** | Description | Key detail |
```

**Pattern B — Formula Block** (quantitative subjects):

```markdown
$$\text{Formula Name} = \frac{\text{Numerator}}{\text{Denominator}}$$

#### Sub-case or Variant
$$\text{Another formula}$$
```

**Pattern C — Bullet Points** (for single-line facts, mnemonics, rules):

```markdown
- **Bold Key Term:** One-line explanation
- **Bold Key Term:** One-line explanation
```

**Pattern D — Hybrid** (formula + table for special cases):

```markdown
$$\text{General Formula}$$

| Case | Mean | Variance |
|------|------|----------|
| $X + Y$ | ... | ... |
```

---

### 3. Question Block Formats

**Format A — Conceptual / MCQ-style** (after concept tables, for qualitative subjects):

Each question sits inside a `>` blockquote, immediately after the relevant content block. Tag each question with its source (**CLA.**, **PYQ.**, or **CLA/PYQ.** if present in both). If the question is neither from CLA nor PYQ, or if the origin is unknown, use **Q.** as the fallback tag. Never use arbitrary question numbers. Answer is **bolded** with a `✓` checkmark. Always ensure proper line breaks / separation between question stems, answers, and consecutive items so they don't run together. Multiple questions stack as separate `>` lines with blank line separation between distinct question-answer pairs where appropriate.

```markdown
> **CLA:** Question stem / keyword = **Answer** ✓
>
> **PYQ:** Another question = **Answer** ✓
>
> **CLA/PYQ:** Statement is TRUE/FALSE = **True** ✓
>
> **Q:** Conceptual question with unknown source = **Answer** ✓
>
> **CLA:** Fill-in-the-blank ______ = **Answer** ✓
```

Variations:
- `**CLA:** X is done by the **Receiver** ✓` — direct fact recall
- `**PYQ:** X leads to Y = **True** ✓` — positive conceptual validation
- `**CLA/PYQ:** Missing step = **Answer** ✓` — scenario-based
- `**Q:** Concept X is defined as = **Answer** ✓` — general/unknown source recall

**Format B — Numerical / Problem-solving** (quantitative subjects):

Tag with source (e.g. `**PYQ:**`, `**CLA:**`, or `**Q:**` if unknown) and problem statement. The solution sits inside the `>` block with a reasoning line, step-by-step working, table lookups, and final answer.

```markdown
**PYQ:** Problem statement with given values.

> *Why: One-line rationale explaining which method/formula applies and why.*
> $\text{Step 1 calculation}$
> $\text{Step 2 calculation}$
> 📋 **{Table Name}:** Lookup details (Row X, Col Y → value)
> $\text{Final computation}$
> **Answer = value** ✓
> *(Parenthetical key takeaway or common-mistake warning)*
```

**Format C — Conceptual with extended explanation**:

```markdown
**CLA:** What does X mean / Which statement is true?

> One-to-two sentence answer in plain text.
```

---

### 4. Formatting Conventions

| Element | Convention |
|---------|-----------|
| **Key terms** | Always **bold** on first/primary mention |
| **Answers** | **Bold** + `✓` checkmark |
| **Question Source Tag** | Use `**CLA:**`, `**PYQ:**`, or `**CLA/PYQ:**`. If neither or source is unknown, fallback to `**Q:**` (do NOT use question numbers) |
| **Negations** | Use **NOT** in bold caps: `**NOT**` |
| **Formulas** | Inline `$...$` for within text; `$$...$$` for standalone |
| **Table lookups** | Prefix with `📋 **Table Name:**` |
| **Tips/warnings** | `*(Italicized in parentheses at end of solution)*` |
| **Rationale line** | `*Why: ...*` in italics as first line of numerical solution |
| **Section dividers** | `---` between topics |
| **TRUE/FALSE & Statements** | Formulate claims positively as true/correct facts (`**True** ✓`) so short notes reinforce the correct concepts directly for revision |
| **Checkmarks** | Every answer ends with `✓` — no exceptions |
| **Line Breaks** | Ensure proper blank line / line breaks between questions, answers, and consecutive question blocks for clear readability |

---

### 5. End-of-Document Summaries

**Quick Reference Table** — condenses "which method to use" or "what to exclude":

```markdown
## Quick Reference: {Title}

| Situation | Action/Answer |
|-----------|---------------|
| Condition A | Method X |
| Condition B | Method Y |
```

**Key Decision Rules Summary** — one-liner rules for exam recall:

```markdown
## Key Decision Rules Summary

| Rule | Detail |
|------|--------|
| Rule name | One-line rule |
```

**Rapid-Fire Q&A** (for large subjects with 50+ questions) — pattern-answer pairs:

```markdown
## RAPID-FIRE: Most Repeated Q&A Patterns

| Question Pattern | Answer |
|-----------------|--------|
| Keyword/stem | One-phrase answer |
```

---

### 6. Content Density Rules

| Principle | Detail |
|-----------|--------|
| **Everything but in revision form** | Full syllabus coverage, zero filler prose — every line is either a fact, formula, table row, or question |
| **Tables over paragraphs** | If 3+ related items exist, use a table |
| **One concept → its questions** | Never separate a concept from its questions; they form an atomic block |
| **Bold = examinable** | If it's bold, it's been tested or is a likely answer |
| **Formulas with variable definitions** | Every formula includes what each symbol means (inline or in adjacent table) |
| **Special cases & exceptions highlighted** | Use `**NOT**`, `**≠**`, parenthetical warnings |
| **No redundant explanation** | If the table says it, don't repeat it in bullets below |

---

### 7. Input → Output Workflow

**Inputs required:**
1. Detailed/verbose lecture notes (full explanations)
2. All classroom questions (CLAs, quizzes)
3. All exam questions (past papers)

**Transformation rules:**
1. Compress each concept into the smallest correct representation (table/formula/bullets)
2. Attach **every** question that tests that concept directly below it
3. For numerical Qs: show full working with table lookups and a `*Why:*` line
4. For conceptual Qs: collapse to `stem = **answer** ✓` one-liner
5. Merge duplicate questions using multi-tag notation (`CLA/PYQ:`)
6. Add Quick Reference and Decision Rules at the end
7. Add Rapid-Fire table if total questions exceed ~40
