# Verification methodology

## Scope

The catalog contains 100 source directory records, split evenly between 50 original selections and 50 expansion selections. The final audit date is recorded per entry in `catalog/skills.json`.

## Checks applied

1. **Directory shape** — each entry is a GitHub `tree/<branch>/<directory>` URL intended to contain `SKILL.md`.
2. **Upstream availability** — `scripts/verify_catalog.py` derives each raw `SKILL.md` URL and requires an HTTP 200 response with non-empty content.
3. **Catalog integrity** — the verifier requires exactly 100 unique records, exactly 10 packs with 10 skills each, 50 `original` and 50 `new` records, valid source links, valid embedded Manus import links, and recognized status values.
4. **Description correction** — the original 50 received a compact, source-backed audit. Misleading or incomplete claims were rewritten; none was retained as an unsupported claim.
5. **Candidate rejection** — the proposed “Folklore Variant Evidence” entry was removed when live evidence showed it was a clinical-genomics skill rather than the described folklore-analysis workflow. It was replaced by the independently reviewed SimPy skill.

## Statuses

| Status | Meaning |
|---|---|
| `verified` | The upstream source is live and the documented workflow works without an explicitly documented external prerequisite beyond ordinary agent/project context. |
| `conditional` | The source is live, but using it requires a stated runtime, credential, integration, hardware, local asset, or project condition. |

Neither status promises that a third-party integration will be available in your environment. It tells you the source is live and what the source itself requires.

## Re-run the verification

```bash
python3 scripts/verify_catalog.py
```

The script does not install or execute any upstream code. It only validates catalog shape and fetches the referenced `SKILL.md` files.
