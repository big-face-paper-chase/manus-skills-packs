# Manus Skills Field Manual

> **100 source-checked Manus and Claude-compatible skills, organized into 10 selectable packs—with direct source links and one-click Manus install URLs.**

[Browse the interactive browser source](./browser/README.md) · [Browse machine-readable catalog](./catalog/skills.json) · [Read installation notes](./docs/INSTALL.md) · [Review original-50 audit](./docs/audits/original-50-audit.md)

## What this is

A practical field guide for agent capabilities—not a random prompt dump. Every listing carries:

- an upstream source and direct Manus import link;
- a concise, corrected statement of what the skill does;
- requirements and a **live-source checked** or **environment-dependent** status; and
- a clear pack assignment so you can choose a small, coherent starting set.

The interactive browser adds search, pack/source filters, alphabetical or verification-date sorting, expandable detail sheets, direct installation, and a browser-local shortlist called the **Field Kit**.

> This repository curates **documentation and links**. It does not redistribute upstream skill implementations. Their own licenses and requirements apply.

## The 10 packs

| # | Pack | Focus | Skills |
|---:|---|---|---:|
| 01 | [Design & UI](./packs/design-ui/README.md) | Distinctive interface, visual-art, presentation, image, and mobile-UI production. | 10 |
| 02 | [Developer Coding](./packs/developer-coding/README.md) | Implementation, testing, debugging, review, frontend architecture, and API integration workflows. | 10 |
| 03 | [Productivity & Workflow](./packs/productivity-workflow/README.md) | Planning, collaboration, communication, file organization, and agent-workflow practices. | 10 |
| 04 | [Research & Data](./packs/research-data/README.md) | Research, document, spreadsheet, PDF, media, marketing, and content-production tasks. | 10 |
| 05 | [Security & DevOps](./packs/security-devops/README.md) | Deployment, workspace safety, verification, skill construction, and external-tool integrations. | 10 |
| 06 | [Agent Craft & Automation](./packs/agent-craft-automation/README.md) | Agent-skill creation, workflow mining, lab-system integration, robotic automation, and reproducible orchestration. | 10 |
| 07 | [Visual Creative Lab](./packs/visual-creative-lab/README.md) | Scientific and creative visual assets, posters, slides, imagery, CAD, and visual analysis workflows. | 10 |
| 08 | [Content, Audience & Growth](./packs/content-audience-growth/README.md) | Evidence-led research, citations, writing, review, grants, market intelligence, and technical documentation. | 10 |
| 09 | [Data, Documents & Decisions](./packs/data-documents-decisions/README.md) | Exploratory analysis, statistics, charts, graph and time-series methods, public data, and structured decision support. | 10 |
| 10 | [Experimental & Delightfully Weird](./packs/experimental-delightfully-weird/README.md) | Specialized scientific-method, simulation, genomics, quantum, time-series, and frontier experimental workflows. | 10 |

## Fast install

1. Open a pack page or the interactive browser.
2. Inspect the **Source** and **Requirements** for the skill you want.
3. Click **Install in Manus**. It opens Manus’s GitHub skill-import route for that exact source directory.
4. Review the skill in Manus and complete the import.

The catalog uses this verified route shape:

```text
https://manus.im/app#settings/skills/import?githubUrl=<URL-encoded GitHub skill directory>
```

A 404 route discovered during the upgrade was removed; links now use the route above. See [INSTALL.md](./docs/INSTALL.md) for manual fallback steps.

## What “source-checked” means

- **Live source checked** — the upstream `SKILL.md` was reachable and the summary matches the reviewed source.
- **Environment-dependent** — the upstream source is live, but actual use requires a named runtime, credential, integration, local asset, hardware, or project context.

The final verification sweep fetched all **100** referenced upstream `SKILL.md` files with HTTP 200. Run the same check yourself:

```bash
python3 scripts/verify_catalog.py
```

## Catalog structure

```text
catalog/skills.json              # canonical 100-record catalog
packs/<pack>/README.md           # readable 10-skill pack pages
docs/INSTALL.md                  # direct-install and manual fallback
docs/PUBLISH.md                  # optional GitHub Pages publication
docs/VERIFICATION.md             # audit methodology and status definitions
docs/audits/original-50-audit.md # original selections reviewed and corrected
browser/                         # standalone React/Vite interactive catalog source
scripts/verify_catalog.py        # catalog shape + upstream availability verifier
```

## Provenance

The original 50 were audited individually. All 50 remained current enough to retain: **23 live-source checked** and **27 environment-dependent**. The expansion adds 50 deliberately unconventional but functional skills, including bounded simulations, experimental design, quantum circuits, visual labs, research operations, and scenario planning.

The source catalog spans:

- [anthropics/skills](https://github.com/anthropics/skills)
- [obra/superpowers](https://github.com/obra/superpowers)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md). In short: submit a source directory containing `SKILL.md`, document what makes it useful, and keep claims constrained to source evidence.

---

Built for people who would rather inspect the wiring than trust a glossy listicle.
