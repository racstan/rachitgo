import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, ExternalLink, Search } from "lucide-react";

const actions = [
  { label: "Home", hint: "Hero and GitHub snapshot", path: "/" },
  { label: "Projects", hint: "DoctlySuite, research, embedded systems", path: "/projects" },
  { label: "Experience", hint: "Timeline, internships, skills", path: "/experience" },
  { label: "Contact", hint: "Email, GitHub, LinkedIn", path: "/contact" },
  { label: "Tech Stack", hint: "Jump to moving stack section", path: "/", hash: "tech-stack" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef(null);
  const lastFocusRef = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return actions;
    return actions.filter((action) => (
      `${action.label} ${action.hint}`.toLowerCase().includes(normalized)
    ));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, query]);

  useEffect(() => {
    if (open) {
      lastFocusRef.current = document.activeElement;
      return undefined;
    }
    lastFocusRef.current?.focus?.();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (!filtered.length) return;

      if (event.key === "Enter" && event.target?.closest?.(".command-results button")) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % filtered.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        runAction(filtered[activeIndex]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, filtered, open]);

  useEffect(() => {
    function onKeyDown(event) {
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if ((event.key === "/" && !isInput) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function runAction(action) {
    setOpen(false);
    setQuery("");
    navigate(action.path);
    if (action.hash) {
      window.setTimeout(() => {
        document.getElementById(action.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  return (
    <>
      <button
        className="command-fab"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        aria-keyshortcuts="Control+K /"
      >
        <Command size={15} />
        <span>Quick switch</span>
        <kbd>/</kbd>
      </button>

      {open && (
        <div className="command-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <div className="command-panel" role="dialog" aria-modal="true" aria-label="Quick portfolio navigation" onMouseDown={(event) => event.stopPropagation()}>
            <div
              ref={panelRef}
              onKeyDown={(event) => {
                if (event.key !== "Tab") return;
                const focusable = panelRef.current?.querySelectorAll(
                  "input, button, [href], [tabindex]:not([tabindex='-1'])",
                );
                if (!focusable || focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first.focus();
                }
              }}
            >
            <div className="command-search">
              <Search size={16} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Jump to proof, projects, stack..."
                role="combobox"
                aria-controls="command-results"
                aria-expanded={open}
                aria-activedescendant={filtered[activeIndex] ? `command-option-${activeIndex}` : undefined}
              />
            </div>
            <div className="command-results" id="command-results" role="listbox" aria-label="Quick switch results">
              {filtered.map((action, index) => (
                <button
                  key={`${action.path}-${action.label}`}
                  id={`command-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  data-active={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runAction(action)}
                >
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.hint}</small>
                  </span>
                  <ExternalLink size={14} />
                </button>
              ))}
              {!filtered.length && <p className="command-empty">No matching section.</p>}
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
