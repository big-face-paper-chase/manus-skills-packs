#!/usr/bin/env python3
"""Validate the static Manus Skills Packs catalog against its upstream SKILL.md files."""
from __future__ import annotations

import concurrent.futures
import json
import re
import sys
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from urllib.parse import unquote

CATALOG = Path(__file__).resolve().parents[1] / 'catalog' / 'skills.json'
SOURCE_PATTERN = re.compile(r'^https://github\.com/([^/]+)/([^/]+)/tree/([^/]+)/(.+)$')
IMPORT_PREFIX = 'https://manus.im/app#settings/skills/import?githubUrl='
REQUIRED = {
    'id', 'name', 'pack', 'kind', 'source_repository', 'source_url',
    'manus_import_url', 'summary', 'use_when', 'tags', 'requirements', 'verification',
}


def raw_skill_url(source_url: str) -> str:
    match = SOURCE_PATTERN.match(source_url)
    if not match:
        raise ValueError(f'Malformed GitHub source URL: {source_url}')
    owner, repo, branch, path = match.groups()
    return f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}/SKILL.md'


def check_source(skill: dict[str, object]) -> str | None:
    source_url = str(skill['source_url'])
    try:
        expected_raw = raw_skill_url(source_url)
        documented_raw = str(skill['verification']['skill_md_url'])
        if documented_raw != expected_raw:
            return f"{skill['id']}: skill_md_url does not match source_url"
        request = urllib.request.Request(
            expected_raw,
            headers={'User-Agent': 'manus-skills-packs-catalog-validator/1.0'},
        )
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status != 200:
                return f"{skill['id']}: SKILL.md returned HTTP {response.status}"
            if not response.read(256).strip():
                return f"{skill['id']}: SKILL.md is empty"
    except (ValueError, urllib.error.URLError, TimeoutError) as exc:
        return f"{skill['id']}: source check failed: {exc}"
    return None


def main() -> int:
    errors: list[str] = []
    try:
        catalog = json.loads(CATALOG.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        print(f'Catalog parse failed: {exc}', file=sys.stderr)
        return 1

    packs = catalog.get('packs', [])
    skills = catalog.get('skills', [])
    pack_ids = [pack.get('id') for pack in packs if isinstance(pack, dict)]
    if len(packs) != 10 or len(set(pack_ids)) != 10:
        errors.append('Catalog must declare exactly 10 uniquely identified packs.')
    if len(skills) != 100:
        errors.append(f'Catalog must contain exactly 100 skills; found {len(skills)}.')

    for skill in skills:
        if not isinstance(skill, dict):
            errors.append('Catalog contains a non-object skill record.')
            continue
        missing = sorted(field for field in REQUIRED if not skill.get(field))
        if missing:
            errors.append(f"{skill.get('id', '<unknown>')}: missing {', '.join(missing)}")
            continue
        if skill['pack'] not in pack_ids:
            errors.append(f"{skill['id']}: unknown pack {skill['pack']}")
        if skill['kind'] not in {'original', 'new'}:
            errors.append(f"{skill['id']}: kind must be original or new")
        if not isinstance(skill['tags'], list) or not skill['tags']:
            errors.append(f"{skill['id']}: tags must be a non-empty array")
        if skill['verification'].get('status') not in {'verified', 'conditional'}:
            errors.append(f"{skill['id']}: verification status must be verified or conditional")
        if not SOURCE_PATTERN.match(skill['source_url']):
            errors.append(f"{skill['id']}: malformed source_url")
        if not skill['manus_import_url'].startswith(IMPORT_PREFIX):
            errors.append(f"{skill['id']}: malformed Manus import URL")
        else:
            embedded = unquote(skill['manus_import_url'].split('githubUrl=', 1)[1])
            if embedded != skill['source_url']:
                errors.append(f"{skill['id']}: Manus import URL does not embed its source_url")

    for field in ('id', 'source_url'):
        values = [skill.get(field) for skill in skills if isinstance(skill, dict)]
        if len(values) != len(set(values)):
            errors.append(f'Catalog contains duplicate {field} values.')

    pack_counts = Counter(skill.get('pack') for skill in skills if isinstance(skill, dict))
    for pack_id in pack_ids:
        if pack_counts[pack_id] != 10:
            errors.append(f'{pack_id}: expected 10 skills, found {pack_counts[pack_id]}.')

    kind_counts = Counter(skill.get('kind') for skill in skills if isinstance(skill, dict))
    if kind_counts != Counter({'original': 50, 'new': 50}):
        errors.append(f'Expected 50 original and 50 new skills; found {dict(kind_counts)}.')

    if not errors:
        with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
            source_errors = list(executor.map(check_source, skills))
        errors.extend(error for error in source_errors if error)

    if errors:
        print('Catalog validation failed:', file=sys.stderr)
        for error in errors:
            print(f'- {error}', file=sys.stderr)
        return 1

    print('Catalog validation passed: 100 skills across 10 packs; all upstream SKILL.md files responded with HTTP 200.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
