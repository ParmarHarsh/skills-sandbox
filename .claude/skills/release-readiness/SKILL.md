---
name: release-readiness
description: Runs a go/no-go readiness check before a build ships to production, staging, a pilot or a launch. It runs the preflight gates, inventories every environment variable the code reads against what is documented, checks migrations, health checks, secrets, backups and the rollback path, and ends in a GO or NO-GO verdict with blockers. Use when the user asks whether an app is ready to deploy, ship, release, launch or pilot, or asks for a preflight, a deployment checklist, or a go/no-go. Not for running the deploy itself or writing CI pipelines.
license: MIT
compatibility: Works best with shell access to run the project's checks. Without it, unrun gates are reported as UNKNOWN.
metadata:
  version: "1.0.0"
---

# Release readiness

Produce a readiness report that ends in one verdict: **GO** or **NO-GO**. A blocking gate that is FAIL or UNKNOWN means NO-GO. Never mark a gate PASS without evidence you saw.

## 1. Target

Pin down three things, stating assumptions where the user didn't say:

- **What ships**: the commit, tag or branch (`git rev-parse --short HEAD`).
- **Where it ships**: production, staging, pilot or preview.
- **The platform**: detect it from config such as `vercel.json`, `Dockerfile`, `fly.toml`, `render.yaml`, `Procfile`, Kubernetes manifests, or CI deploy jobs.

## 2. Preflight gates

Run the project's own checks in the order CI runs them: install, lint, typecheck, test, build, then any smoke or end-to-end script. Record each exact command and its result.

- A check you can't run is **UNKNOWN**, not PASS. Say why it didn't run.
- Count skipped or disabled tests; a skipped test on a core flow is a finding.

## 3. Configuration inventory

Find every environment variable the code reads. Search patterns per language are in [references/env-discovery.md](references/env-discovery.md). For each variable, record:

- where it's read (`path:line`);
- whether it's required, and whether it has a default;
- whether it's documented in `.env.example`, the README or the deploy docs.

Sort the variables into these classes:

- **Required in production**
- **Required only when a feature is enabled**
- **Optional with a safe default**
- **Referenced but unused or unimplemented**

**Blocking:** a required variable that isn't documented, or a secret with an insecure fallback (for example `process.env.SESSION_SECRET || "dev-secret"`). Name variables; never print their values.

## 4. Data

- **Migrations**: which are pending for this release, and are they reversible? Is any destructive (dropping a table or column, a type change, `NOT NULL` without a default)? Should they run before or after the deploy?
- **Backups**: does a backup exist, and has a restore been tested? If nobody knows, the gate is UNKNOWN.

## 5. Runtime

- Health and readiness endpoints exist and check real dependencies, not just "200 OK".
- Workers, queues, scheduled jobs and storage are configured for the target environment.
- External services (email, payments, file storage, AI providers) have credentials and sane timeouts, or are disabled cleanly.

## 6. Security basics

- No secrets committed, and no tracked `.env` files.
- Secret strength is enforced in production.
- Debug and development flags are off.
- Security headers and CORS are scoped.
- Dependency advisories (`npm audit`, `pip-audit` or equivalent) are checked if you can run them.

## 7. Rollback

Write down how to roll this release back: the previous build, the migration down path, feature flags. A destructive migration with no rollback path is blocking.

## 8. Verdict

Use [references/report-template.md](references/report-template.md):

1. **Gate table**: gate, status (PASS, FAIL, UNKNOWN or N/A), evidence, blocking (yes or no).
2. **Verdict line**: `VERDICT: GO` or `VERDICT: NO-GO`.
3. **Blockers**: each with the smallest fix that clears it.
4. **Non-blocking follow-ups**.

Don't deploy, push, or change configuration. Propose fixes and leave them to the user.
