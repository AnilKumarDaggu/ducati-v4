# evals/

Tutor factual-QA evaluation set + harness (RDM-002 §8, ARCH-002 §6).

- `slice_qa.json` — grows to ~50 pairs by Sprint 4. Three seed pairs establish the pattern, including the two guard classes that matter most: the desmo misconception (qa-001) and the placeholder-spec decline (qa-003).
- Harness (Sprint 4): runs every pair against the tutor endpoint, grades with `claude-haiku-4-5`, fails CI above 2% error. The eval gate is **merge-blocking infrastructure, not polish** (RDM-001 §5.4).
