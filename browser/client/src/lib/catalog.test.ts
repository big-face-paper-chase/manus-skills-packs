import { describe, expect, it } from "vitest";
import { filterSkills, skills } from "./catalog";

describe("filterSkills", () => {
  it("keeps the complete verified catalog available", () => {
    expect(skills).toHaveLength(100);
  });

  it("filters by a pack without leaking records from other packs", () => {
    const result = filterSkills(skills, "", "experimental-delightfully-weird", "all", "all", new Set(), "featured");
    expect(result).toHaveLength(10);
    expect(result.every((skill) => skill.pack === "experimental-delightfully-weird")).toBe(true);
  });

  it("searches terms across names, tags, and use cases", () => {
    const result = filterSkills(skills, "discrete-event", "all", "all", "all", new Set(), "alpha");
    expect(result.map((skill) => skill.id)).toContain("simpy");
  });

  it("shows only explicitly saved skills in field-kit mode", () => {
    const result = filterSkills(skills, "", "all", "all", "saved", new Set(["simpy", "frontend-design"]), "alpha");
    expect(result.map((skill) => skill.id)).toEqual(["frontend-design", "simpy"]);
  });
});
