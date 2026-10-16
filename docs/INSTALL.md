# Installation

## One-click route

Every catalog record includes a prebuilt **Install in Manus** URL:

```text
https://manus.im/app#settings/skills/import?githubUrl=<URL-encoded GitHub directory URL>
```

Clicking it opens Manus’s Skills area with the specific upstream GitHub directory prefilled. Review the skill and finish import in Manus.

## Manual fallback

If the direct route is unavailable in your session:

1. In Manus, open **Skills**.
2. Choose **Add** → **Import from GitHub**.
3. Paste the catalog record’s **Source** URL—not this repository URL unless you are importing a skill stored here.
4. Review the discovered `SKILL.md`, its requirements, and upstream license.
5. Import it.

## Important boundaries

- These are upstream third-party skills. Read the source before importing.
- **Environment-dependent** means a skill is current but needs specific local software, account access, integrations, hardware, or project context.
- Importing a skill does not grant it credentials or access you have not configured.
- The catalog is a curator, not an upstream maintainer. Re-run `python3 scripts/verify_catalog.py` before a broad roll-out.
