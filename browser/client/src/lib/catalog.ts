import catalogRaw from "@/data/skills.json";

export type Verification = {
  status: "verified" | "conditional";
  description_accuracy: string;
  evidence_type: string;
  upstream_ref: string;
  audited_on: string;
  skill_md_url: string;
  note: string;
};

export type Skill = {
  id: string;
  name: string;
  pack: string;
  kind: "original" | "new";
  source_repository: string;
  source_url: string;
  manus_import_url: string;
  summary: string;
  use_when: string;
  tags: string[];
  requirements: string;
  verification: Verification;
};

export type Pack = {
  id: string;
  name: string;
  description: string;
};

export type Catalog = {
  schema_version: string;
  generated_on: string;
  packs: Pack[];
  skills: Skill[];
};

export const catalog = catalogRaw as Catalog;
export const packs = catalog.packs;
export const skills = catalog.skills;

export type SortMode = "featured" | "recent" | "alpha";

export function filterSkills(
  records: Skill[],
  query: string,
  pack: string,
  source: string,
  mode: "all" | "saved",
  saved: Set<string>,
  sort: SortMode,
): Skill[] {
  const needle = query.trim().toLowerCase();
  const selected = records.filter((skill) => {
    const haystack = [
      skill.name,
      skill.summary,
      skill.use_when,
      skill.source_repository,
      ...skill.tags,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!needle || haystack.includes(needle)) &&
      (pack === "all" || skill.pack === pack) &&
      (source === "all" || skill.source_repository === source) &&
      (mode === "all" || saved.has(skill.id))
    );
  });

  return [...selected].sort((a, b) => {
    if (sort === "alpha") return a.name.localeCompare(b.name);
    if (sort === "recent") {
      return b.verification.audited_on.localeCompare(a.verification.audited_on) || a.name.localeCompare(b.name);
    }
    return (
      Number(b.verification.status === "verified") - Number(a.verification.status === "verified") ||
      Number(a.kind === "original") - Number(b.kind === "original") ||
      a.name.localeCompare(b.name)
    );
  });
}

export function packById(id: string): Pack | undefined {
  return packs.find((pack) => pack.id === id);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
