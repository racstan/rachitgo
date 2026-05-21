import React from "react";

export default function GitHubContributions({ calendar, loading, error, username, repos = [] }) {
  const weeks = calendar?.weeks ?? [];
  const total = calendar?.totalContributions ?? 0;
  const repoList = Array.isArray(repos) ? repos : [];

  return (
    <article className="github-contrib-card plain-panel" aria-live="polite">
      <div className="github-contrib-head">
        <strong>Contribution activity</strong>
        <a className="github-link" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </div>

      {loading && (
        <p className="github-contrib-empty">Loading contributions...</p>
      )}

      {!loading && error && (
        <p className="github-contrib-empty">{error}</p>
      )}

      {!loading && !error && calendar && (
        <>
          <p className="github-contrib-meta">{total} contributions in the last year</p>
          <div
            className="github-contrib-grid"
            role="img"
            aria-label={`GitHub contributions calendar. ${total} contributions in the last year.`}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="github-contrib-week">
                {week.contributionDays.map((day) => (
                  <div
                    key={day.date}
                    className="github-contrib-day"
                    title={`${day.date}: ${day.contributionCount} contributions`}
                    style={{ backgroundColor: day.color }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="github-contrib-legend">
            <span>Less</span>
            <div className="github-contrib-swatch" style={{ background: "#ebedf0" }} />
            <div className="github-contrib-swatch" style={{ background: "#9be9a8" }} />
            <div className="github-contrib-swatch" style={{ background: "#40c463" }} />
            <div className="github-contrib-swatch" style={{ background: "#30a14e" }} />
            <div className="github-contrib-swatch" style={{ background: "#216e39" }} />
            <span>More</span>
          </div>
          <div className="github-repos">
            <div className="github-repos-head">
              <strong>Top repositories</strong>
              <span>Top 3 by stars</span>
            </div>
            {repoList.length > 0 ? (
              <ul className="github-repo-list">
                {repoList.map((repo) => (
                  <li key={repo.name} className="github-repo-item">
                    <div className="github-repo-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="github-repo-name" style={{ fontWeight: "700", color: "var(--text)" }}>{repo.name}</span>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="github-repo-btn"
                          title="View Repository Website"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            background: "var(--panel-2)",
                            border: "1px solid var(--line)",
                            color: "var(--muted)",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--accent)";
                            e.currentTarget.style.borderColor = "var(--accent)";
                            e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 8%, var(--panel-2))";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--muted)";
                            e.currentTarget.style.borderColor = "var(--line)";
                            e.currentTarget.style.background = "var(--panel-2)";
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      </div>
                      <div className="github-repo-stats">
                        <span className="github-repo-stat">Stars {repo.stargazerCount}</span>
                        <span className="github-repo-stat">Forks {repo.forkCount}</span>
                      </div>
                    </div>
                    {repo.description ? (
                      <p className="github-repo-desc">{repo.description}</p>
                    ) : null}
                    {repo.primaryLanguage ? (
                      <div className="github-repo-language">
                        <span
                          className="github-repo-dot"
                          style={{
                            backgroundColor: repo.primaryLanguage.color || "var(--accent)",
                          }}
                        />
                        <span>{repo.primaryLanguage.name}</span>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="github-contrib-empty">No public repositories to display.</p>
            )}
          </div>
        </>
      )}
    </article>
  );
}
