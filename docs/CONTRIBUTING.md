# Contributing

## Submit a skill candidate

Open an issue or pull request with:

1. A canonical public GitHub directory URL containing `SKILL.md`.
2. A concrete reason the workflow is useful, unusual, or reliably high-leverage.
3. A truthful requirements note: runtime, credentials, integrations, data, hardware, or local assets.
4. A suggested pack and tags.
5. A summary constrained to source evidence—no “best,” “fully autonomous,” or capability claims you cannot substantiate.

## Editorial bar

We prioritize functional skills with clear triggers, procedures, and limits. Variety matters: a duplicate of an existing workflow must be materially better or meaningfully more specialized.

Do not vendor an upstream skill implementation into this repository unless the maintainer has explicitly authorized it and its license allows the distribution. This project primarily links to upstream work.

## Before opening a pull request

```bash
python3 scripts/verify_catalog.py
```

Keep the catalog at exactly 100 entries unless the change explicitly updates the stated project scope and pack balance.
