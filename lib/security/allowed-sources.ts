export const ALLOWED_SOURCE_HOSTS = new Set(["opgla.com", "www.opgla.com"]);

export function isAllowedSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_SOURCE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}
