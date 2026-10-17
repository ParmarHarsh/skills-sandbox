# Finding environment variables

Search the source, then compare against what is documented. Search tracked source only; skip `node_modules`, virtualenvs and build output.

| Ecosystem | Patterns to search |
|---|---|
| Node / TypeScript | `process.env.X`, `process.env["X"]`, destructuring from `process.env`, `import.meta.env.X`, `env("X")` from config libraries, framework prefixes such as `NEXT_PUBLIC_` and `VITE_` |
| Python | `os.environ["X"]`, `os.environ.get("X")`, `os.getenv("X")`, pydantic `BaseSettings` fields, `environ.Env` |
| Ruby | `ENV["X"]`, `ENV.fetch("X")` |
| Go | `os.Getenv("X")`, `os.LookupEnv("X")`, struct tags such as `env:"X"` |
| Java / Kotlin | `System.getenv("X")`, `${X}` in `application.yml` or `.properties` |
| Rust | `std::env::var("X")`, `env!("X")` |
| Containers and platforms | `Dockerfile` `ENV` and `ARG`, compose `environment:`, `vercel.json`, `fly.toml`, `render.yaml`, Kubernetes `env:` and `envFrom:` |
| CI | `env:` blocks and `secrets.X` in workflow files |

A starting search, adjusted to the languages present:

```bash
rg -n --no-heading -e 'process\.env\.?\[?["'\'']?[A-Z0-9_]+' -e 'import\.meta\.env\.[A-Z0-9_]+' \
   -e 'os\.(environ|getenv)' -e 'ENV(\.fetch)?\[' -e 'os\.(Getenv|LookupEnv)' -e 'System\.getenv' .
```

Then list what is documented:

```bash
ls -a | rg '^\.env' ; rg -n '^[A-Z0-9_]+=' .env.example .env.sample 2>/dev/null
```

## Classify each variable

- **Required in production**: read without a default, or the app fails or misbehaves when it's missing.
- **Required when a feature is enabled**: read only on a feature path, such as email, payments or storage.
- **Optional with a safe default**: the default is safe in production too.
- **Insecure fallback (blocking)**: a secret, key or token with a hardcoded default.
- **Referenced but unused**: documented but never read, or read in dead code.

Report names and locations only. Never print values from real environment files.
