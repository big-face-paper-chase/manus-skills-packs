import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Skill } from "@/lib/catalog";

type SkillDetailDialogProps = {
  skill: Skill | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSaved: (id: string) => void;
};

export function SkillDetailDialog({ skill, isSaved, onClose, onToggleSaved }: SkillDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (skill && !dialog.open) dialog.showModal();
    if (!skill && dialog.open) dialog.close();
  }, [skill]);

  useEffect(() => {
    setCopied(false);
  }, [skill?.id]);

  async function copyInstallLink() {
    if (!skill) return;
    try {
      await navigator.clipboard.writeText(skill.manus_import_url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (!skill) return <dialog ref={dialogRef} className="skill-dialog" />;

  return (
    <dialog
      ref={dialogRef}
      className="skill-dialog"
      aria-labelledby="skill-detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="skill-dialog__sheet">
        <div className="skill-dialog__topline">
          <span>{skill.kind === "original" ? "ORIGINAL FIELD NOTE" : "NEW FIELD NOTE"}</span>
          <button className="icon-button" onClick={onClose} aria-label="Close skill details">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="skill-dialog__heading">
          <div>
            <p className="eyebrow">{skill.source_repository}</p>
            <h2 id="skill-detail-title">{skill.name}</h2>
          </div>
          <span className={`verification verification--${skill.verification.status}`}>
            {skill.verification.status === "verified" ? "Live source checked" : "Environment dependent"}
          </span>
        </div>

        <p className="skill-dialog__summary">{skill.summary}</p>

        <section className="detail-section">
          <h3>Use it when</h3>
          <p>{skill.use_when}</p>
        </section>
        <section className="detail-section">
          <h3>Requirements</h3>
          <p>{skill.requirements}</p>
        </section>
        <section className="detail-section">
          <h3>Verification note</h3>
          <p>{skill.verification.note}</p>
          <p className="detail-section__meta">Checked {skill.verification.audited_on} · {skill.verification.upstream_ref}</p>
        </section>

        <div className="tag-list" aria-label="Skill tags">
          {skill.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="skill-dialog__actions">
          <a className="button button--signal" href={skill.manus_import_url} target="_blank" rel="noreferrer">
            Install in Manus <ExternalLink size={16} aria-hidden="true" />
          </a>
          <a className="button button--quiet" href={skill.source_url} target="_blank" rel="noreferrer">
            View source <ExternalLink size={16} aria-hidden="true" />
          </a>
          <button className="button button--quiet" onClick={copyInstallLink}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? "Link copied" : "Copy install link"}
          </button>
          <button className="button button--quiet" onClick={() => onToggleSaved(skill.id)}>
            {isSaved ? "Remove from field kit" : "Save to field kit"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
