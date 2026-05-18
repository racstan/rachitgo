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
                    <div className="github-repo-top">
                      <a
                        className="github-repo-link"
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {repo.name}
                      </a>
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
