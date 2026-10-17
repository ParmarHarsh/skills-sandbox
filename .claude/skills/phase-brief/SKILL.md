---
name: phase-brief
description: Writes the brief that a separate execution session (another Claude Code session or agent) follows to carry out one phase of work, and grades that session's result against its brief. Use when the user asks to write, draft or prepare the brief, handoff or instructions for the next phase, an implementation session, or another agent, or to grade or check a phase result or report against what was asked. Not for project roadmaps, pull request descriptions, or reviewing a diff.
license: MIT
metadata:
  version: "1.0.0"
---

# Phase brief

You are the architect. A different session executes the brief with none of your context, so the brief must stand on its own. This skill has two modes:

- **Write**: produce the brief for the next phase.
- **Grade**: check a returned result against its brief.

## Write a brief

### 1. Ground it in the code

Before writing anything, read what the brief will describe. Collect:

- **Base**: the default branch and its current commit (`git log -1 --oneline`), and the last phase that merged.
- **Gate**: the project's real verification commands, taken from the CI workflow, `package.json` scripts, `Makefile` or equivalent. Use the exact commands, in the order CI runs them.
- **Baseline**: the gate's numbers (tests passing, lint errors and warnings, build and smoke status). Run the gate if you can. If you can't, the executor must record the baseline first.
- **Evidence**: a `path:line` for every claim about the code, from a file you actually opened. Never describe code you haven't read.

If there is no repository to read, say what you are assuming and keep those assumptions visible in the brief.

### 2. Scope one phase

A phase is one coherent outcome that a single session can finish and verify. Split the work when items don't share a verification story. Order items so earlier ones never depend on later ones.

### 3. Write it

Use [references/brief-template.md](references/brief-template.md). Keep the sections in this order:

0. **Setup.**
   - Start a fresh branch from the up-to-date default branch; never continue a merged branch.
   - Then run the install command and the full gate, and give the baseline numbers.
1. **Objective.** One sentence on the outcome, and why it comes now.
2. **Items.** Lettered A, B, C. Each item has:
   - the problem, with `path:line` evidence;
   - the required change;
   - an acceptance check that can be measured: a command, a number, or an observable behavior.
3. **Must not change.** The preserve list: behaviors, APIs, earlier fixes, files and design decisions that must survive this phase. Name each one concretely.
4. **Not in this phase.** Explicit exclusions, each with where it goes instead. List anything the executor may be tempted to fix in passing.
5. **Validation gates.** Numbered, all required:
   - **Inspect before modifying.** If any claim in the brief turns out to be wrong, say so and stop before changing code.
   - **Full gate green**, with each number compared to the baseline.
   - **Existing tests pass unedited.** A test that seems to need a change is a finding: explain why and show that no assertion's meaning was weakened. Never weaken an assertion to get a green run.
   - **Measured before and after** for every item with a measurable acceptance check.
   - **Phase invariants**, when the phase touches them: accessibility checks, layout, performance budgets, data integrity.
   - **Name every file in the diff.**
6. **Report.** Where the executor writes its result record: follow the repo's existing convention for phase records, otherwise `docs/phases/<NN>-result.md`. The record has these sections:
   - Changed (per item: what, where, why)
   - Preserved
   - Verification (each command and its result)
   - Scope deviations (with reasons)
   - Could not verify
   - Disagreements (what the executor disagreed with, and what it did about it)
   - New findings
   - Files changed

   Close with three rules for the executor: a chat summary under 300 words; no pull request unless asked; no roadmap or next-phase proposal.

### 4. Hand it off

Save the brief where the repo keeps briefs, otherwise in `docs/phases/<NN>-brief.md`, when the user wants a file. Otherwise return it in chat. Don't execute the brief yourself unless the user asks.

Before handing off, check that:

- every item has evidence and a measurable acceptance check;
- the preserve list and the exclusions name concrete things;
- the gates use the repo's real commands;
- a reader with no access to this conversation could execute it.

## Grade a result

Read the brief, the result record, and the diff when it's available. Follow [references/grading.md](references/grading.md) and produce:

1. **Item table**: item, claimed outcome, evidence you checked, verdict (Met, Partly met, Not met, Unverified).
2. **Gate check**:
   - compare the numbers against the baseline;
   - flag any edited test or weakened assertion;
   - flag any gate the executor skipped.
3. **Preserve list**: each entry confirmed intact, or violated with evidence.
4. **Scope**: each deviation, and whether it was justified.
5. **Carry forward**: unmet items and new findings that belong in the next brief.

Verify claims yourself wherever you can: run the gate, open the files, read the diff. Label anything you only read in the report as "reported, not verified".
