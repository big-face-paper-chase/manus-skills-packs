import {
  ArrowDownRight,
  Bookmark,
  CheckCircle2,
  Compass,
  ExternalLink,
  Filter,
  Github,
  ListFilter,
  Search,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Magnetic } from "@/components/Magnetic";
import { SignalMap } from "@/components/SignalMap";
import { SkillDetailDialog } from "@/components/SkillDetailDialog";
import {
  filterSkills,
  packById,
  packs,
  skills,
  type Skill,
  type SortMode,
} from "@/lib/catalog";

const GITHUB_REPO = "https://github.com/big-face-paper-chase/manus-skills-packs";
const STORAGE_KEY = "manus-skills-field-kit";

function packTone(id: string) {
  const tones: Record<string, string> = {
    "design-ui": "red",
    "developer-coding": "blue",
    "productivity-workflow": "yellow",
    "research-data": "teal",
    "security-devops": "paper",
    "agent-craft-automation": "blue",
    "visual-creative-lab": "red",
    "content-audience-growth": "yellow",
    "data-documents-decisions": "teal",
    "experimental-delightfully-weird": "paper",
  };
  return tones[id] ?? "paper";
}

function useSavedSkills() {
  const [saved, setSaved] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(saved)));
  }, [saved]);

  function toggle(id: string) {
    setSaved((current) => {
      const next = new Set(current);
      const wasSaved = next.has(id);
      if (wasSaved) next.delete(id);
      else next.add(id);
      toast(wasSaved ? "Removed from field kit" : "Saved to field kit", {
        description: wasSaved ? "The skill is no longer in your shortlist." : "Your shortlist is stored in this browser.",
      });
      return next;
    });
  }

  return { saved, toggle };
}

function SkillLedgerRow({
  skill,
  index,
  saved,
  onOpen,
  onToggle,
}: {
  skill: Skill;
  index: number;
  saved: boolean;
  onOpen: (skill: Skill) => void;
  onToggle: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const pack = packById(skill.pack);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`skill-row ${visible ? "is-visible" : ""}`}
      data-pack={skill.pack}
      style={{ "--entry-delay": `${Math.min(index * 28, 180)}ms` } as React.CSSProperties}
    >
      <div className="skill-row__index" aria-hidden="true">
        <span>{String(index + 1).padStart(3, "0")}</span>
        <i />
      </div>

      <button className="skill-row__main" onClick={() => onOpen(skill)} aria-label={`Open details for ${skill.name}`}>
        <div className="skill-row__headline">
          <div>
            <p className="skill-row__eyebrow">{pack?.name ?? skill.pack}</p>
            <h3>{skill.name}</h3>
          </div>
          <span className={`skill-row__status skill-row__status--${skill.verification.status}`}>
            {skill.verification.status === "verified" ? "Checked" : "Conditional"}
          </span>
        </div>
        <p>{skill.summary}</p>
        <div className="skill-row__tags" aria-label={`Tags for ${skill.name}`}>
          {skill.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
          {skill.tags.length > 3 && <span>+{skill.tags.length - 3}</span>}
        </div>
      </button>

      <div className="skill-row__side">
        <span className="skill-row__source">{skill.source_repository}</span>
        <div className="skill-row__actions">
          <a href={skill.source_url} target="_blank" rel="noreferrer" className="text-action">
            Source <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href={skill.manus_import_url} target="_blank" rel="noreferrer" className="install-action">
            Install <ArrowDownRight size={14} aria-hidden="true" />
          </a>
          <button
            className={`save-action ${saved ? "is-saved" : ""}`}
            onClick={() => onToggle(skill.id)}
            aria-label={saved ? `Remove ${skill.name} from field kit` : `Save ${skill.name} to field kit`}
            title={saved ? "Remove from field kit" : "Save to field kit"}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [pack, setPack] = useState("all");
  const [source, setSource] = useState("all");
  const [mode, setMode] = useState<"all" | "saved">("all");
  const [sort, setSort] = useState<SortMode>("featured");
  const [selected, setSelected] = useState<Skill | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { saved, toggle } = useSavedSkills();
  const searchRef = useRef<HTMLInputElement>(null);

  const sources = useMemo(
    () => Array.from(new Set(skills.map((skill) => skill.source_repository))).sort(),
    [],
  );
  const filtered = useMemo(
    () => filterSkills(skills, query, pack, source, mode, saved, sort),
    [query, pack, source, mode, saved, sort],
  );
  const activeFilters = Number(pack !== "all") + Number(source !== "all") + Number(mode !== "all") + Number(Boolean(query));

  useEffect(() => {
    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  function clearFilters() {
    setQuery("");
    setPack("all");
    setSource("all");
    setMode("all");
    setSort("featured");
    searchRef.current?.focus();
  }

  function surprise() {
    const pool = filtered.length ? filtered : skills;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setSelected(random);
    toast("Signal acquired", { description: `${random.name} is your next strange useful thing.` });
  }

  return (
    <div className="field-manual">
      <a className="skip-link" href="#catalog">Skip to catalog</a>
      <div className="scroll-indicator" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Manus Skills Field Manual home">
          <span className="wordmark__mark" aria-hidden="true">M</span>
          <span>Manus Skills<br /><em>Field Manual</em></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#catalog">Catalog</a>
          <a href="#method">Method</a>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} aria-hidden="true" /></a>
        </nav>
        <button className="field-kit-toggle" onClick={() => setMode(mode === "saved" ? "all" : "saved")} aria-pressed={mode === "saved"}>
          <Bookmark size={15} fill={mode === "saved" ? "currentColor" : "none"} aria-hidden="true" />
          <span>Field kit</span>
          <b>{saved.size}</b>
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--signal"><Compass size={14} aria-hidden="true" /> Curated, not scraped</p>
            <h1 id="hero-title">A better way to<br /><span>teach an agent tricks.</span></h1>
            <p className="hero__lede">One hundred current, source-checked skills for Manus and Claude-compatible agents. Pick a pack. Inspect the source. Install the useful weird stuff.</p>
            <div className="hero__actions">
              <Magnetic>
                <a href="#catalog" className="button button--signal">Explore all 100 <ArrowDownRight size={17} aria-hidden="true" /></a>
              </Magnetic>
              <button className="button button--quiet" onClick={surprise}><Shuffle size={16} aria-hidden="true" /> Surprise me</button>
            </div>
            <dl className="hero__numbers" aria-label="Catalog statistics">
              <div><dt>100</dt><dd>source-checked skills</dd></div>
              <div><dt>10</dt><dd>selectable packs</dd></div>
              <div><dt>50 / 50</dt><dd>original + new</dd></div>
            </dl>
          </div>
          <div className="hero__art" aria-label="Abstract catalog signal map">
            <SignalMap />
            <div className="hero__art-label hero__art-label--top">FIELD SIGNAL / 001</div>
            <div className="hero__art-label hero__art-label--bottom">100 live paths</div>
          </div>
        </section>

        <section className="manifest" id="method" aria-labelledby="manifest-title">
          <div className="manifest__label"><span /> Method</div>
          <div>
            <h2 id="manifest-title">No mystery meat prompts.</h2>
            <p>Every entry points straight to its upstream source, carries an honest requirements note, and exposes the same one-click Manus import route. “Conditional” means the skill is current, but needs a particular runtime, integration, credential, or local asset.</p>
          </div>
          <a href={`${GITHUB_REPO}/blob/main/docs/audits/original-50-audit.md`} target="_blank" rel="noreferrer" className="text-action manifest__audit">
            Read the original 50 audit <ArrowDownRight size={15} aria-hidden="true" />
          </a>
        </section>

        <section className="pack-rack" aria-labelledby="pack-title">
          <div className="section-heading">
            <p className="eyebrow">Choose your terrain</p>
            <h2 id="pack-title">Ten ways in.</h2>
          </div>
          <div className="pack-rack__scroller" role="list">
            <button className={`pack-tab ${pack === "all" ? "is-active" : ""}`} onClick={() => setPack("all")} aria-pressed={pack === "all"}>
              <span>00</span> All terrain <b>100</b>
            </button>
            {packs.map((item, index) => (
              <button
                key={item.id}
                className={`pack-tab pack-tab--${packTone(item.id)} ${pack === item.id ? "is-active" : ""}`}
                onClick={() => setPack(item.id)}
                aria-pressed={pack === item.id}
                title={item.description}
              >
                <span>{String(index + 1).padStart(2, "0")}</span> {item.name} <b>10</b>
              </button>
            ))}
          </div>
        </section>

        <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
          <div className="catalog-section__top">
            <div>
              <p className="eyebrow"><ListFilter size={14} aria-hidden="true" /> Live catalog</p>
              <h2 id="catalog-title">Find your next capability.</h2>
            </div>
            <button className="surprise-link" onClick={surprise}><Sparkles size={15} aria-hidden="true" /> Throw me a curveball</button>
          </div>

          <div className="instrument-panel" aria-label="Catalog filters">
            <label className="search-box">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search skills</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, tags, use cases…"
              />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} aria-hidden="true" /></button>}
            </label>
            <label className="select-box">
              <span>Source</span>
              <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="Filter by source repository">
                <option value="all">All sources</option>
                {sources.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="select-box">
              <span>Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Sort skills">
                <option value="featured">Featured</option>
                <option value="recent">Newest verification</option>
                <option value="alpha">A–Z</option>
              </select>
            </label>
            <button className={`mode-toggle ${mode === "saved" ? "is-active" : ""}`} onClick={() => setMode(mode === "saved" ? "all" : "saved")} aria-pressed={mode === "saved"}>
              <Bookmark size={15} fill={mode === "saved" ? "currentColor" : "none"} aria-hidden="true" /> Saved {saved.size ? `(${saved.size})` : ""}
            </button>
          </div>

          <div className="catalog-meta" aria-live="polite">
            <span><strong>{filtered.length}</strong> {filtered.length === 1 ? "skill" : "skills"} in view</span>
            {activeFilters > 0 && <button className="text-action" onClick={clearFilters}><Filter size={13} aria-hidden="true" /> Reset instruments</button>}
          </div>

          <div className="catalog-ledger" aria-label="Skill catalog results">
            {filtered.length ? filtered.map((skill, index) => (
              <SkillLedgerRow key={skill.id} skill={skill} index={index} saved={saved.has(skill.id)} onOpen={setSelected} onToggle={toggle} />
            )) : (
              <div className="empty-state">
                <Search size={28} aria-hidden="true" />
                <h3>No signal on that frequency.</h3>
                <p>Try a different pack, source, tag, or search phrase.</p>
                <button className="button button--quiet" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
          </div>
        </section>

        <section className="install-note" aria-labelledby="install-title">
          <div className="install-note__glyph"><CheckCircle2 size={28} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow">The install protocol</p>
            <h2 id="install-title">One click opens Manus. Source stays visible.</h2>
            <p>Install buttons open Manus’s GitHub import flow in a new tab. The source link is always beside it, because you should be able to inspect what you’re adding to your agent.</p>
          </div>
          <a href={`${GITHUB_REPO}/blob/main/docs/INSTALL.md`} className="text-action" target="_blank" rel="noreferrer">Read installation notes <ExternalLink size={14} aria-hidden="true" /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wordmark"><span className="wordmark__mark" aria-hidden="true">M</span><span>Manus Skills<br /><em>Field Manual</em></span></div>
        <p>100 source-linked skills. Curated documentation only; upstream licenses govern their implementations.</p>
        <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="text-action"><Github size={15} aria-hidden="true" /> View the repository</a>
      </footer>

      <SkillDetailDialog skill={selected} isSaved={selected ? saved.has(selected.id) : false} onClose={() => setSelected(null)} onToggleSaved={toggle} />
    </div>
  );
}
