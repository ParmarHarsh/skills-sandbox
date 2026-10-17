# Readiness: <app> → <environment>

_Commit `<sha>` (<branch or tag>), platform <platform>, checked <date>._

## Gates

| Gate | Status | Evidence | Blocking |
|---|---|---|---|
| Install | PASS / FAIL / UNKNOWN | `<cmd>`: <result> | yes |
| Lint | | | yes |
| Typecheck | | | yes |
| Tests | | <passed / failed / skipped> | yes |
| Build | | | yes |
| Smoke / e2e | | | yes |
| Env vars documented | | <n required, n undocumented> | yes |
| No insecure secret fallbacks | | | yes |
| Migrations safe and ordered | | | yes |
| Backup and tested restore | | | yes, for production |
| Health and readiness checks | | | no |
| Security headers and CORS | | | no |
| Dependency advisories | | | depends on severity |
| Rollback path | | | yes |

## Environment variables

| Variable | Read at | Class | Documented | Note |
|---|---|---|---|---|
| `EXAMPLE_URL` | `src/config.ts:12` | Required in production | yes | |

VERDICT: <GO | NO-GO>

## Blockers

1. <blocker>: <smallest fix that clears it>

## Non-blocking follow-ups

- <item>
