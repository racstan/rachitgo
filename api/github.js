const GITHUB_ENDPOINT = "https://api.github.com/graphql";

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

function getLogin(req) {
  if (process.env.GITHUB_USERNAME) return process.env.GITHUB_USERNAME;
  try {
    const url = new URL(req.url, "http://localhost");
    return url.searchParams.get("username");
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const login = getLogin(req);

  if (!token || !login) {
    res.status(200).json({
      calendar: null,
      repos: [],
      error: !token ? "Missing GITHUB_TOKEN." : "Missing GITHUB_USERNAME.",
    });
    return;
  }

  try {
    const response = await fetch(GITHUB_ENDPOINT, {
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

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ calendar: null, repos: [], error: text });
      return;
    }

    const data = await response.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
    const repos = data?.data?.user?.repositories?.nodes ?? [];
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=43200");
    res.status(200).json({ calendar, repos });
  } catch (error) {
    res.status(500).json({
      calendar: null,
      repos: [],
      error: "Failed to fetch GitHub contributions.",
    });
  }
}
