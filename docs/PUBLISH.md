# Publish the interactive browser

The repository contains a GitHub Actions workflow that builds the interactive browser on every push to `main`. Deployment to GitHub Pages is intentionally **manual** so ordinary documentation updates do not fail when Pages has not been enabled for the repository.

## Enable it once

1. Open [GitHub Pages settings](https://github.com/big-face-paper-chase/manus-skills-packs/settings/pages).
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Open the [Deploy interactive catalog workflow](https://github.com/big-face-paper-chase/manus-skills-packs/actions/workflows/pages.yml).
4. Select **Run workflow** on `main`.

GitHub Pages will publish the built browser at:

```text
https://big-face-paper-chase.github.io/manus-skills-packs/
```

## Why this is manual

The repository token used for this upgrade can push commits and edit repository metadata, but GitHub denied Pages-site provisioning (`403 Resource not accessible by integration`). The workflow itself builds successfully; enabling Pages requires an owner-authorized repository setting. Once that setting is enabled, dispatch the workflow above to deploy without changing source code.
