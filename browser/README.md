# Interactive browser

The public source for the **Manus Skills Field Manual** browser. It is a static React + Vite app that reads its local copy of `client/src/data/skills.json`.

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm dev
```

When changing the catalog, mirror `../../catalog/skills.json` into `client/src/data/skills.json`, then run both the repository validator and browser tests.
