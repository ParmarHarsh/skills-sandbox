# Phase <NN>: <short outcome>

_Written for the execution session. Base: `<default branch>` at `<commit>` (<last merged phase or PR>)._

## 0. Setup

```bash
git fetch origin <default branch> && git checkout -b <new-branch> origin/<default branch>
<install command>
<full gate, exactly as CI runs it>
```

Baseline at `<commit>`: <lint errors / warnings>, <typecheck>, <N tests passing>, <build>, <smoke or e2e>.
If you can't reproduce this baseline, stop and report the difference before changing anything.

## 1. Objective

<One sentence: the outcome when this phase is done.> <One sentence: why it comes now.>

## 2. Items

### A · <title>

- **Problem.** <what is wrong or missing> (`path/to/file.ext:123`)
- **Change.** <what to do, at the level of behavior; name the files you expect to change>
- **Acceptance.** <a command, number or observable behavior that proves it>

### B · <title>

…

## 3. Must not change

- <behavior, API or route> stays exactly as it is.
- <earlier fix or decision> (<where it was made>) survives intact.
- <file, module or design token set> is out of bounds.

## 4. Not in this phase

- <tempting adjacent fix>: goes to <later phase or ticket>.
- <refactor you might be drawn into>: not now, because <reason>.

## 5. Validation gates

1. **Inspect before modifying.** Confirm every `path:line` claim above. If any is wrong, say so and stop.
2. **Full gate green.** Report each command's result against the baseline: <expected numbers>.
3. **Existing tests pass unedited.** A test that seems to need a change is a finding: explain why, and show no assertion's meaning weakened. Never weaken an assertion.
4. **Before and after.** For each item with a measurable acceptance check, report the value before and after.
5. **Invariants.** <phase-specific: accessibility, layout, performance, data integrity>.
6. **Name every file in the diff.**

## 6. Report

Write `<path>/<NN>-result.md` with:

- **Changed**: per item, what, where and why
- **Preserved**
- **Verification**: each command and its result
- **Scope deviations**: with reasons
- **Could not verify**
- **Disagreements**: what you disagreed with, and what you did
- **New findings**
- **Files changed**

Chat summary under 300 words. No pull request unless asked. No roadmap or next-phase proposal.
