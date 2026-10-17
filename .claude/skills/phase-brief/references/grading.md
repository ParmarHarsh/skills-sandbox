# Grading a phase result

Work from evidence, in this order.

1. **Re-read the brief.** List its items, preserve list, exclusions, gates and report sections. These are the grading criteria. Don't add new criteria after the fact; put new expectations under "Carry forward".
2. **Check the record's shape.** Every required report section is present. A missing "Could not verify" or "Files changed" section is itself a finding.
3. **Check the gate.**
   - Run it yourself if you can.
   - Compare each number with the baseline in the brief. Fewer tests than baseline, new warnings, or a skipped command each needs an explanation.
   - Look at changes to test files in the diff. Treat any loosened assertion, `skip`, deleted test, or widened tolerance as **Not met** unless the record explains it and the explanation holds.
4. **Grade each item.**
   - **Met**: the acceptance check passes and you verified it.
   - **Partly met**: some of the acceptance is shown, the rest is missing or failing.
   - **Not met**: the acceptance fails, or the change is absent.
   - **Unverified**: the record claims it but you couldn't check it. Say what would check it.
5. **Check the preserve list.** Each entry should show no change in the diff, or an explained and acceptable change.
6. **Check scope.** A diff touching files outside the brief's items is a deviation. Judge each one: justified (the brief was wrong or incomplete), harmless, or should be reverted.
7. **Carry forward.** Unmet and partly met items, justified new findings, and corrections to the brief's own claims.

Output: the item table first, then the gate, preserve list and scope checks, then carry-forward. Keep each verdict to one line of evidence.
