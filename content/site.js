// Repository link used in the footer.
//
// Leave REPO_URL empty to detect it automatically on GitHub Pages:
// https://<owner>.github.io/<repo>/  ->  https://github.com/<owner>/<repo>
// Set it explicitly if the site is hosted elsewhere (for example a custom domain).
export const REPO_URL = "";

export function repositoryUrl() {
  if (REPO_URL) return REPO_URL;
  const host = location.hostname;
  if (!host.endsWith(".github.io")) return null;
  const owner = host.slice(0, -".github.io".length);
  const repo = location.pathname.split("/").filter(Boolean)[0];
  return repo ? `https://github.com/${owner}/${repo}` : `https://github.com/${owner}/${host}`;
}
