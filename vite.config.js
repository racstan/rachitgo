import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

function githubProxy() {
  return {
    name: "github-proxy",
    configureServer(server) {
      server.middlewares.use("/api/github", async (req, res, next) => {
        const token = process.env.GITHUB_TOKEN;
        const url = new URL(req.url || "", "http://localhost");
        const login = process.env.GITHUB_USERNAME || url.searchParams.get("username");

        if (!token || !login) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            calendar: null,
            error: !token ? "Missing GITHUB_TOKEN." : "Missing GITHUB_USERNAME.",
          }));
          return;
        }

        try {
          const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
              Authorization: `bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: QUERY,
              variables: { login },
            }),
          });

          const data = await response.json();
          const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ calendar }));
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ calendar: null, error: "Failed to fetch GitHub contributions." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), githubProxy()],
  };
});
