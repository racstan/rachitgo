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
      repositories(
        first: 3,
        ownerAffiliations: [OWNER],
        isFork: false,
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

function apiProxy() {
  return {
    name: "api-proxy",
    configureServer(server) {
      // 1. GitHub endpoint
      server.middlewares.use("/api/github", async (req, res, next) => {
        const token = process.env.GITHUB_TOKEN;
        const url = new URL(req.url || "", "http://localhost");
        const login = process.env.GITHUB_USERNAME || url.searchParams.get("username");

        if (!token || !login) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            calendar: null,
            repos: [],
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
          const repos = data?.data?.user?.repositories?.nodes ?? [];
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ calendar, repos }));
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ calendar: null, repos: [], error: "Failed to fetch GitHub contributions." }));
        }
      });

      // 2. Resume AI chat endpoint
      server.middlewares.use("/api/chat", async (req, res, next) => {
        let body = "";
        req.on("data", chunk => {
          body += chunk;
        });
        req.on("end", async () => {
          const mockReq = {
            method: req.method,
            body: body,
            url: req.url,
          };
          const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader(name, val) {
              this.headers[name] = val;
            },
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(data) {
              res.statusCode = this.statusCode;
              res.setHeader("Content-Type", "application/json");
              for (const [k, v] of Object.entries(this.headers)) {
                res.setHeader(k, v);
              }
              res.end(JSON.stringify(data));
            }
          };

          try {
            const chatHandler = (await import("./api/chat.js")).default;
            await chatHandler(mockReq, mockRes);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: `Vite API Dev Proxy error: ${err.message}` }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), apiProxy()],
    envPrefix: ["VITE_", "BREVO_"],
  };
});
